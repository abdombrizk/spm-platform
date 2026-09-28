import { z } from "zod";
import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { ownerProcedure, permissionProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { createSessionToken, hashPassword, hashSessionToken, sessionExpiresAt, validatePassword, verifyPassword, INTERNAL_SESSION_COOKIE } from "./internalAuth";
import { userRoles, UserRole } from "../drizzle/schema";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

const roleSchema = z.enum(userRoles);
const loginPasswordSchema = z.string().min(8);
const strongPasswordSchema = z.string().min(12);
const productTypeSchema = z.enum(["medical_device", "spare_part", "accessory"]);
const productDataSchema = z.object({
  name: z.string().min(2).max(255),
  code: z.string().max(120).optional().default(""),
  modelNumber: z.string().max(120).optional().default(""),
  category: z.string().max(120).optional().default(""),
  brand: z.string().max(160).optional().default(""),
  manufacturer: z.string().max(255).optional().default(""),
  supplier: z.string().max(255).optional().default(""),
  countryOfOrigin: z.string().max(120).optional().default(""),
  shortDescription: z.string().max(600).optional().default(""),
  fullDescription: z.string().max(12000).optional().default(""),
  features: z.array(z.string().max(500)).max(30).optional().default([]),
  applications: z.array(z.string().max(500)).max(30).optional().default([]),
  technicalSpecifications: z.object({
    generatorPower: z.string().max(120).optional().default(""),
    tubeVoltage: z.string().max(120).optional().default(""),
    tubeCurrent: z.string().max(120).optional().default(""),
    detectorType: z.string().max(160).optional().default(""),
    imageReceptor: z.string().max(160).optional().default(""),
    fluoroscopyModes: z.string().max(300).optional().default(""),
    dimensions: z.string().max(160).optional().default(""),
    weight: z.string().max(120).optional().default(""),
    powerRequirements: z.string().max(160).optional().default(""),
    warranty: z.string().max(160).optional().default(""),
  }).optional().default({ generatorPower: "", tubeVoltage: "", tubeCurrent: "", detectorType: "", imageReceptor: "", fluoroscopyModes: "", dimensions: "", weight: "", powerRequirements: "", warranty: "" }),
  mainImage: z.string().max(2000).optional().default(""),
  additionalImages: z.array(z.string().max(2000)).max(12).optional().default([]),
  brochureUrl: z.string().max(2000).optional().default(""),
  datasheetUrl: z.string().max(2000).optional().default(""),
  userManualUrl: z.string().max(2000).optional().default(""),
  videoUrl: z.string().max(2000).optional().default(""),
  availabilityStatus: z.enum(["available", "on_request", "discontinued", "coming_soon"]).default("on_request"),
  requestQuote: z.boolean().default(true),
  ceStatus: z.enum(["available", "not_available", "not_applicable", "under_review"]).default("under_review"),
  qualityReviewStatus: z.enum(["not_reviewed", "under_review", "approved", "rejected"]).default("not_reviewed"),
  regulatoryDocumentsPublic: z.boolean().default(false),
  regulatoryDocumentUrl: z.string().max(2000).optional().default(""),
  seoTitle: z.string().max(255).optional().default(""),
  seoDescription: z.string().max(600).optional().default(""),
  featured: z.boolean().default(false),
}).strict();
const serviceTypeSchema = z.enum(["installation", "commissioning", "preventive_maintenance", "corrective_maintenance", "emergency_maintenance", "calibration", "technical_support", "training", "spare_parts_supply", "maintenance_contract"]);
const serviceDataSchema = z.object({
  name: z.string().min(2).max(255),
  code: z.string().max(120).optional().default(""),
  shortDescription: z.string().max(600).optional().default(""),
  fullDescription: z.string().max(12000).optional().default(""),
  coveredProductIds: z.array(z.number().int().positive()).max(100).optional().default([]),
  coveredEquipmentManual: z.string().max(2000).optional().default(""),
  supportedBrands: z.array(z.string().max(160)).max(30).optional().default([]),
  serviceScope: z.string().max(6000).optional().default(""),
  includedActivities: z.array(z.string().max(500)).max(30).optional().default([]),
  excludedActivities: z.array(z.string().max(500)).max(30).optional().default([]),
  responseTime: z.string().max(160).optional().default(""),
  countries: z.array(z.string().max(120)).max(100).optional().default([]),
  availability: z.enum(["available", "on_request", "limited", "not_available"]).default("on_request"),
  mainImage: z.string().max(2000).optional().default(""),
  additionalImages: z.array(z.string().max(2000)).max(12).optional().default([]),
  brochureUrl: z.string().max(2000).optional().default(""),
  videoUrl: z.string().max(2000).optional().default(""),
  requestService: z.boolean().default(true),
  requestQuote: z.boolean().default(true),
  qualityReviewStatus: z.enum(["not_reviewed", "under_review", "approved", "rejected"]).default("not_reviewed"),
  serviceProcedureReference: z.string().max(255).optional().default(""),
  revisionNumber: z.string().max(80).optional().default(""),
  effectiveDate: z.string().max(40).optional().default(""),
  internalNotes: z.string().max(5000).optional().default(""),
  seoTitle: z.string().max(255).optional().default(""),
  seoDescription: z.string().max(600).optional().default(""),
}).strict();
const serviceRequestTypeSchema = z.enum(["corrective_maintenance", "preventive_maintenance", "emergency_maintenance", "installation", "commissioning", "calibration", "technical_support", "spare_parts", "training", "maintenance_contract", "other"]);
const serviceRequestEquipmentSchema = z.object({
  productId: z.number().int().positive().optional(),
  equipmentCategory: z.string().min(2).max(160),
  manufacturer: z.string().max(255).optional(),
  model: z.string().max(180).optional(),
  serialNumber: z.string().max(180).optional(),
  assetNumber: z.string().max(180).optional(),
  installationYear: z.number().int().min(1900).max(2200).optional(),
  lastMaintenanceDate: z.string().max(40).optional(),
  warrantyStatus: z.enum(["under_warranty", "out_of_warranty", "unknown"]).default("unknown"),
  equipmentLocation: z.string().max(180).optional(),
  roomDepartment: z.string().max(180).optional(),
  deviceAddress: z.string().max(5000).optional(),
  operationalStatus: z.enum(["yes", "partially", "no", "unknown"]).default("unknown"),
  problemTitle: z.string().min(2).max(255),
  problemDescription: z.string().min(2).max(12000),
  errorCode: z.string().max(255).optional(),
  alarmMessage: z.string().max(5000).optional(),
  problemStartedAt: z.string().max(120).optional(),
  occurrencePattern: z.enum(["continuous", "intermittent", "unknown"]).default("unknown"),
  precedingEvent: z.string().max(180).optional(),
  safeToUse: z.enum(["yes", "no", "unknown"]).default("unknown"),
  previousMaintenance: z.string().max(12000).optional(),
});
const serviceRequestCreateSchema = z.object({
  serviceId: z.number().int().positive().optional(),
  organizationName: z.string().max(255).optional(),
  requesterType: z.enum(["doctor", "biomedical_engineer", "technician", "procurement_officer", "hospital", "clinic", "medical_center", "distributor", "private_company", "government_entity", "individual", "other"]).optional(),
  contactPerson: z.string().min(2).max(255),
  jobTitle: z.string().max(180).optional(),
  email: z.string().email(),
  phone: z.string().min(5).max(80),
  whatsapp: z.string().max(80).optional(),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp", "any"]).default("any"),
  country: z.string().min(2).max(120),
  city: z.string().max(160).optional(),
  address: z.string().max(5000).optional(),
  visitRequired: z.enum(["yes", "no", "not_sure"]).default("not_sure"),
  preferredVisitDate: z.string().max(40).optional(),
  preferredVisitTime: z.string().max(80).optional(),
  siteAccessNotes: z.string().max(12000).optional(),
  requestType: serviceRequestTypeSchema,
  source: z.enum(["website", "product_page", "service_page", "whatsapp", "email", "manual", "campaign"]).default("website"),
  equipment: z.array(serviceRequestEquipmentSchema).min(1).max(20),
  safetyAcknowledged: z.literal(true),
  noPatientDataAcknowledged: z.literal(true),
  honeypot: z.string().max(1).optional().default(""),
});
const serviceRequestStatusSchema = z.enum(["new", "under_review", "assigned", "waiting_for_customer", "remote_diagnosis", "site_visit_required", "quotation_required", "awaiting_approval", "scheduled", "in_progress", "waiting_for_parts", "resolved", "customer_confirmation", "closed", "cancelled"]);

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
    updateProductPermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ permission: z.string().min(1), granted: z.boolean() })) })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner permissions are always retained." });
      await db.replaceScopedPermissions(input.userId, "products", input.permissions);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_permissions_updated", entityType: "user", entityId: String(input.userId), metadata: { count: input.permissions.length }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    updateServicePermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ permission: z.string().min(1), granted: z.boolean() })) })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner permissions are always retained." });
      await db.replaceScopedPermissions(input.userId, "services", input.permissions);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_permissions_updated", entityType: "user", entityId: String(input.userId), metadata: { count: input.permissions.length }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    updateQuotePermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ permission: z.string().min(1), granted: z.boolean() })) })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner permissions are always retained." });
      await db.replaceScopedPermissions(input.userId, "quotes", input.permissions);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "quote_permissions_updated", entityType: "user", entityId: String(input.userId), metadata: { count: input.permissions.length }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    updateServiceRequestPermissions: ownerProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ permission: z.string().min(1), granted: z.boolean() })) })).mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user.id) throw new TRPCError({ code: "BAD_REQUEST", message: "The Owner permissions are always retained." });
      await db.replaceScopedPermissions(input.userId, "service_requests", input.permissions);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_request_permissions_updated", entityType: "user", entityId: String(input.userId), metadata: { count: input.permissions.length }, ipAddress: clientIp(ctx.req) });
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
  products: router({
    permissions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "owner") return ["products.view", "products.create", "products.edit", "products.media", "products.quality", "products.publish", "products.archive", "products.delete"];
      const permissions = await db.listPermissions(ctx.user.id);
      return permissions.filter(item => item.granted && item.permission.startsWith("products.")).map(item => item.permission);
    }),
    published: publicProcedure.query(async () => {
      const rows = await db.listPublishedProducts();
      return rows.map(row => ({ ...row, data: JSON.parse(row.publishedData) }));
    }),
    publishedBySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ input }) => {
      const row = await db.getPublishedProductBySlug(input.slug);
      return row ? { ...row, data: JSON.parse(row.publishedData) } : null;
    }),
    list: permissionProcedure("products.view").query(async () => db.listProducts()),
    create: permissionProcedure("products.create").input(z.object({ slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), productType: productTypeSchema, data: productDataSchema, draftVisible: z.boolean().default(true), displayOrder: z.number().int().min(0).max(99999).default(0) })).mutation(async ({ ctx, input }) => {
      try {
        const id = await db.createProduct({ slug: input.slug, productType: input.productType, draftData: JSON.stringify(input.data), draftVisible: input.draftVisible, displayOrder: input.displayOrder, createdBy: ctx.user.id });
        await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_created", entityType: "product", entityId: String(id), metadata: { slug: input.slug, productType: input.productType }, ipAddress: clientIp(ctx.req) });
        return { id };
      } catch (error) {
        if (String(error).includes("Duplicate")) throw new TRPCError({ code: "CONFLICT", message: "A product with this slug already exists." });
        throw error;
      }
    }),
    update: permissionProcedure("products.edit").input(z.object({ id: z.number().int().positive(), slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), productType: productTypeSchema, data: productDataSchema, draftVisible: z.boolean(), displayOrder: z.number().int().min(0).max(99999) })).mutation(async ({ ctx, input }) => {
      const target = await db.getProductById(input.id);
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      let data = input.data;
      if (ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "products.quality"))) {
        const current = JSON.parse(target.draftData) as Partial<typeof input.data>;
        data = { ...input.data, ceStatus: current.ceStatus ?? input.data.ceStatus, qualityReviewStatus: current.qualityReviewStatus ?? input.data.qualityReviewStatus, regulatoryDocumentsPublic: current.regulatoryDocumentsPublic ?? input.data.regulatoryDocumentsPublic, regulatoryDocumentUrl: current.regulatoryDocumentUrl ?? input.data.regulatoryDocumentUrl };
      }
      await db.updateProduct(input.id, { slug: input.slug, productType: input.productType, draftData: JSON.stringify(data), draftVisible: input.draftVisible, displayOrder: input.displayOrder, updatedBy: ctx.user.id });
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_updated", entityType: "product", entityId: String(input.id), metadata: { slug: input.slug }, ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    publish: permissionProcedure("products.publish").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const ok = await db.publishProduct(input.id, ctx.user.id);
      if (!ok) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found." });
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_published", entityType: "product", entityId: String(input.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    archive: permissionProcedure("products.archive").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      await db.archiveProduct(input.id, ctx.user.id);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_archived", entityType: "product", entityId: String(input.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    restore: permissionProcedure("products.edit").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      await db.restoreProduct(input.id, ctx.user.id);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_restored", entityType: "product", entityId: String(input.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    delete: permissionProcedure("products.delete").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      await db.deleteProduct(input.id);
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "product_deleted", entityType: "product", entityId: String(input.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    uploadMedia: permissionProcedure("products.media").input(z.object({ id: z.number().int().positive(), field: z.enum(["mainImage", "additionalImages", "brochureUrl", "datasheetUrl", "userManualUrl", "regulatoryDocumentUrl"]), fileName: z.string().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]), dataUrl: z.string().startsWith("data:") })).mutation(async ({ ctx, input }) => {
      const encoded = input.dataUrl.split(",")[1];
      if (!encoded) throw new TRPCError({ code: "BAD_REQUEST", message: "File data is missing." });
      const buffer = Buffer.from(encoded, "base64");
      if (buffer.byteLength > 12 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "File must be 12 MB or smaller." });
      const extension = input.contentType === "application/pdf" ? "pdf" : input.contentType.split("/")[1];
      const uploaded = await storagePut(`products/${input.id}/${input.field}.${extension}`, buffer, input.contentType);
      return { url: uploaded.url };
    }),
  }),
  services: router({
    permissions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "owner") return ["services.view", "services.create", "services.edit", "services.media", "services.quality", "services.publish", "services.archive", "services.delete"];
      const permissions = await db.listPermissions(ctx.user.id);
      return permissions.filter(item => item.granted && item.permission.startsWith("services.")).map(item => item.permission);
    }),
    published: publicProcedure.query(async () => (await db.listPublishedServices()).map(row => ({ ...row, data: JSON.parse(row.publishedData) }))),
    publishedBySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(async ({ input }) => {
      const row = await db.getPublishedServiceBySlug(input.slug);
      return row ? { ...row, data: JSON.parse(row.publishedData) } : null;
    }),
    list: permissionProcedure("services.view").query(async () => db.listServices()),
    create: permissionProcedure("services.create").input(z.object({ slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), serviceType: serviceTypeSchema, data: serviceDataSchema, draftVisible: z.boolean().default(true), displayOrder: z.number().int().min(0).max(99999).default(0) })).mutation(async ({ ctx, input }) => {
      try {
        const id = await db.createService({ slug: input.slug, serviceType: input.serviceType, draftData: JSON.stringify(input.data), draftVisible: input.draftVisible, displayOrder: input.displayOrder, createdBy: ctx.user.id });
        await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_created", entityType: "service", entityId: String(id), metadata: { slug: input.slug, serviceType: input.serviceType }, ipAddress: clientIp(ctx.req) });
        return { id };
      } catch (error) {
        if (String(error).includes("Duplicate")) throw new TRPCError({ code: "CONFLICT", message: "A service with this slug already exists." });
        throw error;
      }
    }),
    update: permissionProcedure("services.edit").input(z.object({ id: z.number().int().positive(), slug: z.string().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), serviceType: serviceTypeSchema, data: serviceDataSchema, draftVisible: z.boolean(), displayOrder: z.number().int().min(0).max(99999) })).mutation(async ({ ctx, input }) => {
      const target = await db.getServiceById(input.id);
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "Service not found." });
      let data = input.data;
      if (ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "services.quality"))) {
        const current = JSON.parse(target.draftData) as Partial<typeof input.data>;
        data = { ...input.data, qualityReviewStatus: current.qualityReviewStatus ?? input.data.qualityReviewStatus, serviceProcedureReference: current.serviceProcedureReference ?? input.data.serviceProcedureReference, revisionNumber: current.revisionNumber ?? input.data.revisionNumber, effectiveDate: current.effectiveDate ?? input.data.effectiveDate, internalNotes: current.internalNotes ?? input.data.internalNotes };
      }
      await db.updateService(input.id, { slug: input.slug, serviceType: input.serviceType, draftData: JSON.stringify(data), draftVisible: input.draftVisible, displayOrder: input.displayOrder, updatedBy: ctx.user.id });
      await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_updated", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) });
      return { success: true } as const;
    }),
    submitReview: permissionProcedure("services.edit").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.submitServiceReview(input.id, ctx.user.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_submitted_for_review", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    approve: permissionProcedure("services.quality").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.approveService(input.id, ctx.user.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_approved", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    publish: permissionProcedure("services.publish").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const service = await db.getServiceById(input.id);
      if (!service) throw new TRPCError({ code: "NOT_FOUND", message: "Service not found." });
      if (ctx.user.role !== "owner" && service.workflowStatus !== "approved") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Service must be approved before publishing." });
      await db.publishService(input.id, ctx.user.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_published", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const;
    }),
    archive: permissionProcedure("services.archive").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.archiveService(input.id, ctx.user.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_archived", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    restore: permissionProcedure("services.edit").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.restoreService(input.id, ctx.user.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_restored", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    delete: permissionProcedure("services.delete").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.deleteService(input.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_deleted", entityType: "service", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    uploadMedia: permissionProcedure("services.media").input(z.object({ id: z.number().int().positive(), field: z.enum(["mainImage", "additionalImages", "brochureUrl"]), fileName: z.string().min(1).max(180), contentType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]), dataUrl: z.string().startsWith("data:") })).mutation(async ({ ctx, input }) => {
      const encoded = input.dataUrl.split(",")[1]; if (!encoded) throw new TRPCError({ code: "BAD_REQUEST", message: "File data is missing." }); const buffer = Buffer.from(encoded, "base64"); if (buffer.byteLength > 12 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "File must be 12 MB or smaller." }); const extension = input.contentType === "application/pdf" ? "pdf" : input.contentType.split("/")[1]; const uploaded = await storagePut(`services/${input.id}/${input.field}.${extension}`, buffer, input.contentType); return { url: uploaded.url };
    }),
  }),
  serviceRequests: router({
    create: publicProcedure.input(serviceRequestCreateSchema).mutation(async ({ input }) => {
      if (input.honeypot) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to submit this request." });
      const { equipment, honeypot: _honeypot, ...request } = input;
      const result = await db.createServiceRequest({ ...request, source: input.source }, equipment);
      void notifyOwner({ title: `New service request ${result.publicNumber}`, content: `${input.contactPerson} submitted a ${input.requestType.replaceAll("_", " ")} request from ${input.country}. Review it in the SPM workspace.` }).catch(() => undefined);
      return result;
    }),
    uploadAttachment: publicProcedure.input(z.object({ serviceRequestId: z.number().int().positive(), accessToken: z.string().min(20).max(100), equipmentId: z.number().int().positive().optional(), fileName: z.string().min(1).max(255), contentType: z.enum(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"]), sizeBytes: z.number().int().positive().max(20 * 1024 * 1024), description: z.string().max(255).optional(), dataUrl: z.string().startsWith("data:") })).mutation(async ({ input }) => {
      const serviceRequest = await db.getServiceRequest(input.serviceRequestId);
      if (!serviceRequest) throw new TRPCError({ code: "NOT_FOUND", message: "Service request not found." });
      if (serviceRequest.request.publicAccessToken !== input.accessToken) throw new TRPCError({ code: "FORBIDDEN", message: "The service request access token is invalid." });
      if (input.equipmentId && !serviceRequest.equipment.some(item => item.id === input.equipmentId)) throw new TRPCError({ code: "BAD_REQUEST", message: "The selected equipment does not belong to this request." });
      if (serviceRequest.attachments.length >= 10) throw new TRPCError({ code: "BAD_REQUEST", message: "A maximum of 10 files is allowed." });
      const encoded = input.dataUrl.split(",")[1];
      if (!encoded) throw new TRPCError({ code: "BAD_REQUEST", message: "File data is missing." });
      const buffer = Buffer.from(encoded, "base64");
      if (buffer.byteLength > 20 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Each file must be 20 MB or smaller." });
      if (serviceRequest.attachments.reduce((sum, item) => sum + item.sizeBytes, 0) + buffer.byteLength > 100 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "The total attachment size must be 100 MB or smaller." });
      const extension = input.fileName.split(".").pop()?.toLowerCase() || "bin";
      const uploaded = await storagePut(`service-requests/${input.serviceRequestId}/${randomUUID()}.${extension}`, buffer, input.contentType);
      const id = await db.addServiceRequestAttachment({ serviceRequestId: input.serviceRequestId, equipmentId: input.equipmentId, fileName: input.fileName, contentType: input.contentType, sizeBytes: buffer.byteLength, storageUrl: uploaded.url, description: input.description });
      return { id, url: uploaded.url };
    }),
    list: permissionProcedure("service_requests.view").query(async () => db.listServiceRequests()),
    assignees: permissionProcedure("service_requests.assign").query(async () => (await db.listInternalUsers()).filter(user => user.isActive && ["owner", "manager", "sales", "service"].includes(user.role))),
    get: permissionProcedure("service_requests.view").input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { const result = await db.getServiceRequest(input.id); if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "Service request not found." }); return result; }),
    updateStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: serviceRequestStatusSchema })).mutation(async ({ ctx, input }) => { if (ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "service_requests.status"))) throw new TRPCError({ code: "FORBIDDEN", message: "Missing permission: service_requests.status" }); if (["closed", "cancelled"].includes(input.status) && ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "service_requests.close"))) throw new TRPCError({ code: "FORBIDDEN", message: "Missing permission: service_requests.close" }); await db.updateServiceRequest(input.id, { status: input.status, closedAt: ["closed", "cancelled"].includes(input.status) ? new Date() : null }); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_request_status_updated", entityType: "service_request", entityId: String(input.id), metadata: { status: input.status }, ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    assign: permissionProcedure("service_requests.assign").input(z.object({ id: z.number().int().positive(), assignedServiceUserId: z.number().int().positive().nullable().optional(), assignedSalesUserId: z.number().int().positive().nullable().optional(), priority: z.enum(["low", "normal", "high", "urgent"]).optional() })).mutation(async ({ ctx, input }) => { if (input.priority !== undefined && ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "service_requests.priority"))) throw new TRPCError({ code: "FORBIDDEN", message: "Missing permission: service_requests.priority" }); await db.updateServiceRequest(input.id, input); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_request_assignment_updated", entityType: "service_request", entityId: String(input.id), metadata: input, ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    addComment: permissionProcedure("service_requests.comments").input(z.object({ serviceRequestId: z.number().int().positive(), body: z.string().min(1).max(12000) })).mutation(async ({ ctx, input }) => { const request = await db.getServiceRequest(input.serviceRequestId); if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "Service request not found." }); const id = await db.addServiceRequestComment({ serviceRequestId: input.serviceRequestId, userId: ctx.user.id, body: input.body }); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_request_comment_added", entityType: "service_request", entityId: String(input.serviceRequestId), metadata: { commentId: id }, ipAddress: clientIp(ctx.req) }); return { id }; }),
    linkQuote: permissionProcedure("service_requests.edit").input(z.object({ id: z.number().int().positive(), quoteRequestId: z.number().int().positive().nullable() })).mutation(async ({ ctx, input }) => { await db.updateServiceRequest(input.id, { quoteRequestId: input.quoteRequestId }); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_request_quote_linked", entityType: "service_request", entityId: String(input.id), metadata: { quoteRequestId: input.quoteRequestId }, ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    delete: permissionProcedure("service_requests.delete").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.deleteServiceRequest(input.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "service_request_deleted", entityType: "service_request", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
  }),
  quotes: router({
    create: publicProcedure.input(z.object({
      organizationName: z.string().max(255).optional(), requesterType: z.enum(["doctor", "biomedical_engineer", "technician", "procurement_officer", "hospital", "clinic", "medical_center", "distributor", "private_company", "government_entity", "individual", "other"]).optional(), contactPerson: z.string().min(2).max(255), jobTitle: z.string().max(180).optional(), email: z.string().email(), phone: z.string().min(5).max(80), whatsapp: z.string().max(80).optional(), preferredContactMethod: z.enum(["email", "phone", "whatsapp", "any"]).default("any"), country: z.string().min(2).max(120), city: z.string().max(160).optional(), address: z.string().max(5000).optional(), requiredDeliveryDate: z.string().max(40).optional(), installationRequired: z.enum(["yes", "no", "not_sure"]).default("not_sure"), trainingRequired: z.enum(["yes", "no", "not_sure"]).default("not_sure"), maintenanceContractRequired: z.enum(["yes", "no", "not_sure"]).default("not_sure"), message: z.string().max(10000).optional(), source: z.enum(["website", "product_page", "service_page", "whatsapp", "email", "manual", "campaign"]).default("website"), items: z.array(z.object({ itemType: z.enum(["product", "service", "custom"]), productId: z.number().int().positive().optional(), serviceId: z.number().int().positive().optional(), itemName: z.string().min(1).max(255), quantity: z.number().int().min(1).max(999999).default(1), notes: z.string().max(2000).optional() })).min(1).max(100), honeypot: z.string().max(1).optional().default("")
    })).mutation(async ({ input }) => {
      if (input.honeypot) throw new TRPCError({ code: "BAD_REQUEST", message: "Unable to submit this request." });
      const result = await db.createQuoteRequest({ organizationName: input.organizationName, requesterType: input.requesterType, contactPerson: input.contactPerson, jobTitle: input.jobTitle, email: input.email, phone: input.phone, whatsapp: input.whatsapp, preferredContactMethod: input.preferredContactMethod, country: input.country, city: input.city, address: input.address, requiredDeliveryDate: input.requiredDeliveryDate, installationRequired: input.installationRequired, trainingRequired: input.trainingRequired, maintenanceContractRequired: input.maintenanceContractRequired, message: input.message, source: input.source }, input.items);
      void notifyOwner({ title: `New quote request ${result.publicNumber}`, content: `${input.contactPerson} submitted a request from ${input.country}. Review it in the SPM workspace.` }).catch(() => undefined);
      return result;
    }),
    uploadAttachment: publicProcedure.input(z.object({ quoteRequestId: z.number().int().positive(), fileName: z.string().min(1).max(255), contentType: z.enum(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"]), sizeBytes: z.number().int().positive().max(10 * 1024 * 1024), description: z.string().max(255).optional(), dataUrl: z.string().startsWith("data:") })).mutation(async ({ input }) => {
      const quote = await db.getQuoteRequest(input.quoteRequestId); if (!quote) throw new TRPCError({ code: "NOT_FOUND", message: "Quote request not found." });
      const encoded = input.dataUrl.split(",")[1]; if (!encoded) throw new TRPCError({ code: "BAD_REQUEST", message: "File data is missing." }); const buffer = Buffer.from(encoded, "base64"); if (buffer.byteLength > 10 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Each file must be 10 MB or smaller." }); if (quote.attachments.length >= 5) throw new TRPCError({ code: "BAD_REQUEST", message: "A maximum of 5 files is allowed." }); const extension = input.fileName.split(".").pop()?.toLowerCase() || "bin"; const uploaded = await storagePut(`quote-requests/${input.quoteRequestId}/${randomUUID()}.${extension}`, buffer, input.contentType); const id = await db.addQuoteAttachment({ quoteRequestId: input.quoteRequestId, fileName: input.fileName, contentType: input.contentType, sizeBytes: buffer.byteLength, storageUrl: uploaded.url, description: input.description }); return { id, url: uploaded.url };
    }),
    list: permissionProcedure("quotes.view").query(async () => db.listQuoteRequests()),
    assignees: permissionProcedure("quotes.assign").query(async () => (await db.listInternalUsers()).filter(user => user.isActive && ["owner", "manager", "sales", "service"].includes(user.role))),
    get: permissionProcedure("quotes.view").input(z.object({ id: z.number().int().positive() })).query(async ({ input }) => { const result = await db.getQuoteRequest(input.id); if (!result) throw new TRPCError({ code: "NOT_FOUND", message: "Quote request not found." }); return result; }),
    updateStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "under_review", "assigned_to_sales", "preparing_quotation", "sent_to_customer", "customer_responded", "waiting_for_customer", "waiting_for_technical_review", "waiting_for_supplier", "on_hold", "won", "lost", "closed", "cancelled"]) })).mutation(async ({ ctx, input }) => { if (ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "quotes.status"))) throw new TRPCError({ code: "FORBIDDEN", message: "Missing permission: quotes.status" }); if (["closed", "won", "lost", "cancelled"].includes(input.status) && ctx.user.role !== "owner" && !(await db.hasPermission(ctx.user.id, "quotes.close"))) throw new TRPCError({ code: "FORBIDDEN", message: "Missing permission: quotes.close" }); await db.updateQuoteRequest(input.id, { status: input.status, closedAt: ["closed", "won", "lost", "cancelled"].includes(input.status) ? new Date() : null }); await db.addAuditLog({ actorUserId: ctx.user.id, action: "quote_status_updated", entityType: "quote_request", entityId: String(input.id), metadata: { status: input.status }, ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    assign: permissionProcedure("quotes.assign").input(z.object({ id: z.number().int().positive(), assignedSalesUserId: z.number().int().positive().nullable().optional(), assignedServiceUserId: z.number().int().positive().nullable().optional(), priority: z.enum(["low", "normal", "high", "urgent"]).optional() })).mutation(async ({ ctx, input }) => { await db.updateQuoteRequest(input.id, { assignedSalesUserId: input.assignedSalesUserId, assignedServiceUserId: input.assignedServiceUserId, priority: input.priority }); await db.addAuditLog({ actorUserId: ctx.user.id, action: "quote_assignment_updated", entityType: "quote_request", entityId: String(input.id), metadata: input, ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
    addComment: permissionProcedure("quotes.edit").input(z.object({ quoteRequestId: z.number().int().positive(), body: z.string().min(1).max(10000) })).mutation(async ({ ctx, input }) => { const id = await db.addQuoteComment({ quoteRequestId: input.quoteRequestId, userId: ctx.user.id, body: input.body }); await db.addAuditLog({ actorUserId: ctx.user.id, action: "quote_comment_added", entityType: "quote_request", entityId: String(input.quoteRequestId), metadata: { commentId: id }, ipAddress: clientIp(ctx.req) }); return { id }; }),
    delete: permissionProcedure("quotes.delete").input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { await db.deleteQuoteRequest(input.id); await db.addAuditLog({ actorUserId: ctx.user.id, action: "quote_deleted", entityType: "quote_request", entityId: String(input.id), ipAddress: clientIp(ctx.req) }); return { success: true } as const; }),
  }),
});

export type AppRouter = typeof appRouter;
