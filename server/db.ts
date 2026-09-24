import { and, desc, eq, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  auditLogs,
  homepageContent,
  InsertUser,
  internalSessions,
  userPermissions,
  users,
  UserRole,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { hashSessionToken } from "./internalAuth";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) {
    const value = user[field];
    if (value !== undefined && value !== null) {
      values[field] = value;
      updateSet[field] = value;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "owner";
    updateSet.role = "owner";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  return result[0];
}

export async function listInternalUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    role: users.role,
    isActive: users.isActive,
    mustChangePassword: users.mustChangePassword,
    createdAt: users.createdAt,
    lastSignedIn: users.lastSignedIn,
  }).from(users).orderBy(desc(users.createdAt));
}

export async function createInternalUser(input: {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const openId = `internal:${input.email.toLowerCase()}`;
  const result = await db.insert(users).values({
    openId,
    name: input.name,
    email: input.email.toLowerCase(),
    loginMethod: "internal",
    role: input.role,
    passwordHash: input.passwordHash,
    mustChangePassword: true,
    isActive: true,
    failedLoginAttempts: 0,
  });
  return Number(result[0].insertId);
}

export async function updateInternalUser(id: number, input: {
  name?: string;
  role?: UserRole;
  isActive?: boolean;
  mustChangePassword?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set(input).where(eq(users.id, id));
}

export async function setUserPassword(id: number, passwordHash: string, mustChangePassword: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(users).set({ passwordHash, mustChangePassword, failedLoginAttempts: 0, lockedUntil: null }).where(eq(users.id, id));
}

export async function recordFailedLogin(id: number, attempts: number, lockedUntil: Date | null) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ failedLoginAttempts: attempts, lockedUntil }).where(eq(users.id, id));
}

export async function recordSuccessfulLogin(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ failedLoginAttempts: 0, lockedUntil: null, lastSignedIn: new Date() }).where(eq(users.id, id));
}

export async function createInternalSession(userId: number, tokenHash: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(internalSessions).values({ userId, tokenHash, expiresAt });
}

export async function getUserBySessionToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const session = await db.select().from(internalSessions).where(and(eq(internalSessions.tokenHash, hashSessionToken(token)), gt(internalSessions.expiresAt, new Date()))).limit(1);
  if (!session[0]) return undefined;
  return getUserById(session[0].userId);
}

export async function deleteInternalSession(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.delete(internalSessions).where(eq(internalSessions.tokenHash, hashSessionToken(token)));
}

export async function addAuditLog(input: {
  actorUserId?: number;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(auditLogs).values({
    actorUserId: input.actorUserId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: input.metadata ? JSON.stringify(input.metadata) : undefined,
    ipAddress: input.ipAddress,
  });
}

export async function listPermissions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userPermissions).where(eq(userPermissions.userId, userId));
}

export async function hasPermission(userId: number, permission: string) {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select().from(userPermissions).where(and(eq(userPermissions.userId, userId), eq(userPermissions.permission, permission), eq(userPermissions.granted, true))).limit(1);
  return rows.length > 0;
}

export async function replacePermissions(userId: number, permissions: Array<{ permission: string; granted: boolean }>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(userPermissions).where(eq(userPermissions.userId, userId));
  if (permissions.length) await db.insert(userPermissions).values(permissions.map(item => ({ userId, ...item })));
}

export async function replaceHomepagePermissions(userId: number, permissions: Array<{ permission: string; granted: boolean }>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await listPermissions(userId);
  const preserved = existing.filter(item => !item.permission.startsWith("homepage."));
  await db.delete(userPermissions).where(eq(userPermissions.userId, userId));
  const next = [...preserved.map(item => ({ permission: item.permission, granted: item.granted })), ...permissions];
  if (next.length) await db.insert(userPermissions).values(next.map(item => ({ userId, ...item })));
}

export async function listHomepageContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(homepageContent).orderBy(homepageContent.sortOrder);
}

export async function listPublishedHomepageContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    contentKey: homepageContent.contentKey,
    contentType: homepageContent.contentType,
    publishedValue: homepageContent.publishedValue,
    isVisible: homepageContent.publishedVisible,
    sortOrder: homepageContent.sortOrder,
  }).from(homepageContent).orderBy(homepageContent.sortOrder);
}

export async function updateHomepageDraft(items: Array<{ contentKey: string; draftValue: string; isVisible?: boolean }>, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  for (const item of items) {
    await db.update(homepageContent).set({ draftValue: item.draftValue, isVisible: item.isVisible, updatedBy: userId }).where(eq(homepageContent.contentKey, item.contentKey));
  }
}

export async function publishHomepage(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await listHomepageContent();
  for (const row of rows) {
    await db.update(homepageContent).set({ publishedValue: row.draftValue, publishedVisible: row.isVisible, publishedBy: userId, publishedAt: new Date() }).where(eq(homepageContent.id, row.id));
  }
}
