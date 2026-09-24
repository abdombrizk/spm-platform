import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ownerProcedure, permissionProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { createSessionToken, hashPassword, hashSessionToken, sessionExpiresAt, validatePassword, verifyPassword, INTERNAL_SESSION_COOKIE } from "./internalAuth";
import { userRoles, UserRole } from "../drizzle/schema";
import { storagePut } from "./storage";

const roleSchema = z.enum(userRoles);
const loginPasswordSchema = z.string().min(8);
const strongPasswordSchema = z.string().min(12);

function clientIp(req: { ip?: string; headers: Record<string, unknown> }) {
  const forwarded = req.headers["x-forwarded-for"];
  return typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : req.ip;
}

function safeUser(user: NonNullable<Awaited<ReturnType<typeof db.getUserById>>>) {
  return {
    id: user.id,
    openId: user.openId,
    name: user.name,
    email: user.email,
    loginMethod: user.loginMethod,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    lastSignedIn: user.lastSignedIn,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user ? safeUser(opts.ctx.user) : null),
    login: publicProcedure.input(z.object({ email: z.string().email(), password: loginPasswordSchema })).mutation(async ({ ctx, input }) => {
      const email = input.email.toLowerCase().trim();
      const user = await db.getUserByEmail(email);
      if (!user || user.loginMethod !== "internal" || !user.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      if (!user.isActive) throw new TRPCError({ code: "FORBIDDEN", message: "This account is inactive." });
      if (user.lockedUntil && user.lockedUntil > new Date()) throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "This account is temporarily locked." });
      const valid = await verifyPassword(input.password, user.passwordHash);
      if (!valid) {
        const attempts = user.failedLoginAttempts + 1;
        const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
        await db.recordFailedLogin(user.id, attempts, lockedUntil);
        await db.addAuditLog({ action: "login_failed", entityType: "user", entityId: String(user.id), metadata: { email }, ipAddress: clientIp(ctx.req) });
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
      }
      await db.recordSuccessfulLogin(user.id);
      const token = createSessionToken();
      await db.createInternalSession(user.id, hashSessionToken(token), sessionExpiresAt());
      await db.addAuditLog({ actorUserId: user.id, action: "login_success", entityType: "user", entityId: String(user.id), ipAddress: clientIp(ctx.req) });
      ctx.res.cookie(INTERNAL_SESSION_COOKIE, token, { ...getSessionCookieOptions(ctx.req), maxAge: 8 * 60 * 60 * 1000 });
      return { success: true, mustChangePassword: user.mustChangePassword } as const;
    }),
    logout: publicProcedure.mutation(async ({ ctx }) => {
      const header = ctx.req.headers.cookie;
      const token = header?.split(";").map(value => value.trim()).find(value => value.startsWith(`${INTERNAL_SESSION_COOKIE}=`))?.split("=").slice(1).join("=");
      if (token) await db.deleteInternalSession(token);
      ctx.res.clearCookie(INTERNAL_SESSION_COOKIE, { ...getSessionCookieOptions(ctx.req), maxAge: -1 });
      if (ctx.user) await db.addAuditLog({ actorUserId: ctx.user.id, action: "logout", entityType: "user", entityId: String(ctx.user.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    changePassword: protectedProcedure.input(z.object({ currentPassword: loginPasswordSchema, newPassword: strongPasswordSchema })).mutation(async ({ ctx, input }) => {
      if (!ctx.user.passwordHash || !(await verifyPassword(input.currentPassword, ctx.user.passwordHash))) throw new TRPCError({ code: "UNAUTHORIZED", message: "Current password is incorrect." });
      const issue = validatePassword(input.newPassword);
      if (issue) throw new TRPCError({ code: "BAD_REQUEST", message: issue });
      await db.setUserPassword(ctx.user.id, await hashPassword(input.newPassword), false);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "password_changed", entityType: "user", entityId: String(ctx.user.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
  }),
  owner: router({
    listUsers: ownerProcedure.query(async () => db.listInternalUsers()),
    createUser: ownerProcedure.input(z.object({ name: z.string().min(2), email: z.string().email(), role: roleSchema, password: strongPasswordSchema })).mutation(async ({ ctx, input }) => {
      const issue = validatePassword(input.password);
      if (issue) throw new TRPCError({ code: "BAD_REQUEST", message: issue });
      try {
        const id = await db.createInternalUser({ name: input.name.trim(), email: input.email, role: input.role as UserRole, passwordHash: await hashPassword(input.password) });
        await db.addAuditLog({ actorUserId: ctx.user.id, action: "user_created", entityType: "user", entityId: String(id), metadata: { role: input.role }, ipAddress: clientIp(ctx.req) });
        return { id };
      } catch (error) {
        const message = String(error);
        if (message.includes("Duplicate")) throw new TRPCError({ code: "CONFLICT", message: "A user with this email already exists." });
        throw error;
      }
    }),
    updateUser: ownerProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().min(2).optional(), role: roleSchema.optional(), isActive: z.boolean().optional(), mustChangePassword: z.boolean().optional() })).mutation(async ({ ctx, input }) => {
      if (input.id === ctx.user.id && input.isActive === false) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner cannot deactivate the current account." });
      const target = await db.getUserById(input.id);
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      if (target.role === "owner" && input.role && input.role !== "owner") throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner role cannot be removed from an Owner account in this first release." });
      await db.updateInternalUser(input.id, input);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "user_updated", entityType: "user", entityId: String(input.id), metadata: input, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    resetPassword: ownerProcedure.input(z.object({ id: z.number().int().positive(), password: strongPasswordSchema })).mutation(async ({ ctx, input }) => {
      const issue = validatePassword(input.password);
      if (issue) throw new TRPCError({ code: "BAD_REQUEST", message: issue });
      const target = await db.getUserById(input.id);
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "User not found." });
      await db.setUserPassword(input.id, await hashPassword(input.password), true);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "password_reset_by_owner", entityType: "user", entityId: String(input.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    getPermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive() })).query(async ({ input }) => db.listPermissions(input.userId)),
    replacePermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ permission: z.string().min(1), granted: z.boolean() })) })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner cannot replace the current account permissions from this screen." });
      await db.replacePermissions(input.userId, input.permissions);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "permissions_replaced", entityType: "user", entityId: String(input.userId), metadata: { count: input.permissions.length }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    updateHomepagePermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ permission: z.string().min(1), granted: z.boolean() })) })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner permissions are always retained." });
      await db.replaceHomepagePermissions(input.userId, input.permissions);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "homepage_permissions_updated", entityType: "user", entityId: String(input.userId), metadata: { count: input.permissions.length }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
  }),
  homepage: router({
    published: publicProcedure.query(() => db.listPublishedHomepageContent()),
    draft: permissionProcedure("homepage.edit").query(() => db.listHomepageContent()),
    saveDraft: permissionProcedure("homepage.edit").input(z.object({
      items: z.array(z.object({ contentKey: z.string().min(1), draftValue: z.string().max(10000), isVisible: z.boolean().optional() })),
    })).mutation(async ({ ctx, input }) => {
      await db.updateHomepageDraft(input.items, ctx.user.id);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "homepage_draft_saved", entityType: "homepage", metadata: { itemCount: input.items.length }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    publish: permissionProcedure("homepage.publish").mutation(async ({ ctx }) => {
      await db.publishHomepage(ctx.user.id);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "homepage_published", entityType: "homepage", ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    uploadImage: permissionProcedure("homepage.media").input(z.object({
      contentKey: z.string().min(1),
      fileName: z.string().min(1).max(180),
      contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      dataUrl: z.string().startsWith("data:image/"),
    })).mutation(async ({ ctx, input }) => {
      const encoded = input.dataUrl.split(",")[1];
      if (!encoded) throw new TRPCError({ code: "BAD_REQUEST", message: "Image data is missing." });
      const buffer = Buffer.from(encoded, "base64");
      if (buffer.byteLength > 8 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Image must be 8 MB or smaller." });
      const extension = input.contentType.split("/")[1];
      const uploaded = await storagePut(`homepage/${input.contentKey}.${extension}`, buffer, input.contentType);
      await db.updateHomepageDraft([{ contentKey: input.contentKey, draftValue: uploaded.url }], ctx.user.id);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "homepage_image_uploaded", entityType: "homepage", entityId: input.contentKey, metadata: { fileName: input.fileName, contentType: input.contentType }, ipAddress: clientIp(ctx.req) });
      return { url: uploaded.url };
    }),
  }),
});

export type AppRouter = typeof appRouter;
