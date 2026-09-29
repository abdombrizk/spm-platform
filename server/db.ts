import { and, desc, eq, gt } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { drizzle } from "drizzle-orm/mysql2";
import {
  auditLogs,
  cmsMediaAssets,
  cmsPages,
  homepageContent,
  InsertUser,
  internalSessions,
  products,
  services,
  quoteAttachments,
  quoteComments,
  quoteItems,
  quoteRequests,
  serviceRequestAttachments,
  serviceRequestComments,
  serviceRequestEquipment,
  serviceRequests,
  siteStats,
  productBrands,
  productMenuItems,
  sparePartBrands,
  spareParts,
  documentRequests,
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
  const user = await getUserById(userId);
  if (!user || !user.isActive) return false;
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

export async function replaceScopedPermissions(userId: number, scope: string, permissions: Array<{ permission: string; granted: boolean }>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await listPermissions(userId);
  const preserved = existing.filter(item => !item.permission.startsWith(`${scope}.`));
  await db.delete(userPermissions).where(eq(userPermissions.userId, userId));
  const next = [...preserved.map(item => ({ permission: item.permission, granted: item.granted })), ...permissions];
  if (next.length) await db.insert(userPermissions).values(next.map(item => ({ userId, ...item })));
}

export async function listAuditLogs(limit = 200) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: auditLogs.id,
    actorUserId: auditLogs.actorUserId,
    actorName: users.name,
    actorEmail: users.email,
    action: auditLogs.action,
    entityType: auditLogs.entityType,
    entityId: auditLogs.entityId,
    metadata: auditLogs.metadata,
    ipAddress: auditLogs.ipAddress,
    createdAt: auditLogs.createdAt,
  }).from(auditLogs).leftJoin(users, eq(auditLogs.actorUserId, users.id)).orderBy(desc(auditLogs.createdAt)).limit(limit);
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

export async function listProducts(includeArchived = true) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(products).orderBy(products.displayOrder, desc(products.updatedAt));
  return includeArchived ? rows : rows.filter(row => row.workflowStatus !== "archived");
}

export async function listPublishedProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    id: products.id,
    slug: products.slug,
    productType: products.productType,
    publishedData: products.publishedData,
    publishedVisible: products.publishedVisible,
    displayOrder: products.displayOrder,
    publishedAt: products.publishedAt,
  }).from(products).where(and(eq(products.workflowStatus, "published"), eq(products.publishedVisible, true))).orderBy(products.displayOrder, desc(products.publishedAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0];
}

export async function getPublishedProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.workflowStatus, "published"), eq(products.publishedVisible, true))).limit(1);
  return rows[0];
}

export async function createProduct(input: {
  slug: string;
  productType: "medical_device" | "spare_part" | "accessory";
  draftData: string;
  draftVisible: boolean;
  displayOrder: number;
  createdBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(products).values({ ...input, publishedData: input.draftData, publishedVisible: false, workflowStatus: "draft" });
  return Number(result[0].insertId);
}

export async function updateProduct(id: number, input: { slug?: string; productType?: "medical_device" | "spare_part" | "accessory"; draftData?: string; draftVisible?: boolean; displayOrder?: number; updatedBy: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(products).set(input).where(eq(products.id, id));
}

export async function publishProduct(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const product = await getProductById(id);
  if (!product) return false;
  await db.update(products).set({ publishedData: product.draftData, publishedVisible: product.draftVisible, workflowStatus: "published", publishedBy: userId, publishedAt: new Date(), archivedAt: null }).where(eq(products.id, id));
  return true;
}

export async function archiveProduct(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(products).set({ workflowStatus: "archived", archivedAt: new Date(), updatedBy: userId }).where(eq(products.id, id));
}

export async function restoreProduct(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(products).set({ workflowStatus: "draft", archivedAt: null, updatedBy: userId, draftVisible: false }).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(products).where(eq(products.id, id));
}

export async function listServices(includeArchived = true) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(services).orderBy(services.displayOrder, desc(services.updatedAt));
  return includeArchived ? rows : rows.filter(row => row.workflowStatus !== "archived");
}

export async function listPublishedServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ id: services.id, slug: services.slug, serviceType: services.serviceType, publishedData: services.publishedData, publishedVisible: services.publishedVisible, displayOrder: services.displayOrder, publishedAt: services.publishedAt }).from(services).where(and(eq(services.workflowStatus, "published"), eq(services.publishedVisible, true))).orderBy(services.displayOrder, desc(services.publishedAt));
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return rows[0];
}

export async function getPublishedServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(services).where(and(eq(services.slug, slug), eq(services.workflowStatus, "published"), eq(services.publishedVisible, true))).limit(1);
  return rows[0];
}

export async function createService(input: { slug: string; serviceType: string; draftData: string; draftVisible: boolean; displayOrder: number; createdBy: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(services).values({ ...input, serviceType: input.serviceType as any, publishedData: input.draftData, publishedVisible: false, workflowStatus: "draft" });
  return Number(result[0].insertId);
}

export async function updateService(id: number, input: { slug?: string; serviceType?: string; draftData?: string; draftVisible?: boolean; displayOrder?: number; updatedBy: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(services).set({ ...input, serviceType: input.serviceType as any }).where(eq(services.id, id));
}

export async function submitServiceReview(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(services).set({ workflowStatus: "pending_review", updatedBy: userId }).where(eq(services.id, id));
}

export async function approveService(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(services).set({ workflowStatus: "approved", reviewedBy: userId, reviewedAt: new Date(), updatedBy: userId }).where(eq(services.id, id));
}

export async function publishService(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const service = await getServiceById(id);
  if (!service) return false;
  await db.update(services).set({ publishedData: service.draftData, publishedVisible: service.draftVisible, workflowStatus: "published", publishedBy: userId, publishedAt: new Date(), archivedAt: null }).where(eq(services.id, id));
  return true;
}

export async function archiveService(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(services).set({ workflowStatus: "archived", archivedAt: new Date(), updatedBy: userId }).where(eq(services.id, id));
}

export async function restoreService(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(services).set({ workflowStatus: "draft", archivedAt: null, updatedBy: userId, draftVisible: false }).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(services).where(eq(services.id, id));
}

export async function createQuoteRequest(input: Omit<typeof quoteRequests.$inferInsert, "id" | "publicNumber" | "createdAt" | "updatedAt">, items: Array<Omit<typeof quoteItems.$inferInsert, "id" | "quoteRequestId" | "createdAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const pendingNumber = `PENDING-${randomUUID()}`;
  const result = await db.insert(quoteRequests).values({ ...input, publicNumber: pendingNumber });
  const id = Number(result[0].insertId);
  const publicNumber = `SPM-Q-${new Date().getUTCFullYear()}-${String(id).padStart(6, "0")}`;
  await db.update(quoteRequests).set({ publicNumber }).where(eq(quoteRequests.id, id));
  if (items.length) await db.insert(quoteItems).values(items.map(item => ({ ...item, quoteRequestId: id })));
  return { id, publicNumber };
}

export async function listQuoteRequests() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(quoteRequests).orderBy(desc(quoteRequests.updatedAt));
  return rows;
}

export async function getQuoteRequest(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const requests = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
  if (!requests[0]) return undefined;
  const items = await db.select().from(quoteItems).where(eq(quoteItems.quoteRequestId, id));
  const attachments = await db.select().from(quoteAttachments).where(eq(quoteAttachments.quoteRequestId, id)).orderBy(desc(quoteAttachments.createdAt));
  const comments = await db.select().from(quoteComments).where(eq(quoteComments.quoteRequestId, id)).orderBy(desc(quoteComments.createdAt));
  return { request: requests[0], items, attachments, comments };
}

export async function updateQuoteRequest(id: number, input: Partial<typeof quoteRequests.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(quoteRequests).set(input).where(eq(quoteRequests.id, id));
}

export async function addQuoteComment(input: Omit<typeof quoteComments.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(quoteComments).values(input);
  return Number(result[0].insertId);
}

export async function addQuoteAttachment(input: Omit<typeof quoteAttachments.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(quoteAttachments).values(input);
  return Number(result[0].insertId);
}

export async function deleteQuoteRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(quoteComments).where(eq(quoteComments.quoteRequestId, id));
  await db.delete(quoteAttachments).where(eq(quoteAttachments.quoteRequestId, id));
  await db.delete(quoteItems).where(eq(quoteItems.quoteRequestId, id));
  await db.delete(quoteRequests).where(eq(quoteRequests.id, id));
}

export async function createServiceRequest(input: Omit<typeof serviceRequests.$inferInsert, "id" | "publicNumber" | "publicAccessToken" | "createdAt" | "updatedAt">, equipment: Array<Omit<typeof serviceRequestEquipment.$inferInsert, "id" | "serviceRequestId" | "createdAt">>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const pendingNumber = `PENDING-${randomUUID()}`;
  const publicAccessToken = `${randomUUID()}${randomUUID()}`;
  const result = await db.insert(serviceRequests).values({ ...input, publicNumber: pendingNumber, publicAccessToken });
  const id = Number(result[0].insertId);
  const publicNumber = `SPM-SR-${new Date().getUTCFullYear()}-${String(id).padStart(6, "0")}`;
  await db.update(serviceRequests).set({ publicNumber }).where(eq(serviceRequests.id, id));
  const equipmentIds: number[] = [];
  for (const item of equipment) {
    const equipmentResult = await db.insert(serviceRequestEquipment).values({ ...item, serviceRequestId: id });
    equipmentIds.push(Number(equipmentResult[0].insertId));
  }
  return { id, publicNumber, publicAccessToken, equipmentIds };
}

export async function listServiceRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceRequests).orderBy(desc(serviceRequests.updatedAt));
}

export async function getServiceRequest(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const requests = await db.select().from(serviceRequests).where(eq(serviceRequests.id, id)).limit(1);
  if (!requests[0]) return undefined;
  const equipment = await db.select().from(serviceRequestEquipment).where(eq(serviceRequestEquipment.serviceRequestId, id));
  const attachments = await db.select().from(serviceRequestAttachments).where(eq(serviceRequestAttachments.serviceRequestId, id)).orderBy(desc(serviceRequestAttachments.createdAt));
  const comments = await db.select().from(serviceRequestComments).where(eq(serviceRequestComments.serviceRequestId, id)).orderBy(desc(serviceRequestComments.createdAt));
  return { request: requests[0], equipment, attachments, comments };
}

export async function updateServiceRequest(id: number, input: Partial<typeof serviceRequests.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(serviceRequests).set(input).where(eq(serviceRequests.id, id));
}

export async function addServiceRequestComment(input: Omit<typeof serviceRequestComments.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(serviceRequestComments).values(input);
  return Number(result[0].insertId);
}

export async function addServiceRequestAttachment(input: Omit<typeof serviceRequestAttachments.$inferInsert, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(serviceRequestAttachments).values(input);
  return Number(result[0].insertId);
}

export async function deleteServiceRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(serviceRequestComments).where(eq(serviceRequestComments.serviceRequestId, id));
  await db.delete(serviceRequestAttachments).where(eq(serviceRequestAttachments.serviceRequestId, id));
  await db.delete(serviceRequestEquipment).where(eq(serviceRequestEquipment.serviceRequestId, id));
  await db.delete(serviceRequests).where(eq(serviceRequests.id, id));
}


export async function listCmsPages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmsPages).orderBy(cmsPages.slug);
}

export async function getCmsPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(cmsPages).where(eq(cmsPages.slug, slug)).limit(1);
  return rows[0];
}

export async function getPublishedCmsPageBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(cmsPages).where(and(eq(cmsPages.slug, slug), eq(cmsPages.workflowStatus, "published"), eq(cmsPages.publishedVisible, true))).limit(1);
  return rows[0];
}

export async function upsertCmsPage(input: { slug: string; pageType: "about" | "maintenance_contracts" | "faqs" | "downloads" | "news" | "events" | "careers" | "spare_parts" | "resources" | "contact" | "privacy" | "terms"; draftData: string; draftVisible: boolean; requiresQaReview: boolean; userId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existing = await getCmsPageBySlug(input.slug);
  if (existing) {
    await db.update(cmsPages).set({ pageType: input.pageType, draftData: input.draftData, draftVisible: input.draftVisible, requiresQaReview: input.requiresQaReview, updatedBy: input.userId, workflowStatus: existing.workflowStatus === "published" ? "published" : "draft" }).where(eq(cmsPages.id, existing.id));
    return existing.id;
  }
  const result = await db.insert(cmsPages).values({ slug: input.slug, pageType: input.pageType, draftData: input.draftData, publishedData: input.draftData, draftVisible: input.draftVisible, publishedVisible: false, requiresQaReview: input.requiresQaReview, createdBy: input.userId, updatedBy: input.userId, workflowStatus: "draft" });
  return Number(result[0].insertId);
}

export async function submitCmsPageReview(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(cmsPages).set({ workflowStatus: "pending_review", updatedBy: userId }).where(eq(cmsPages.id, id));
}

export async function reviewCmsPage(id: number, userId: number, approved: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(cmsPages).set({ workflowStatus: approved ? "approved" : "draft", reviewedBy: userId, reviewedAt: new Date() }).where(eq(cmsPages.id, id));
}

export async function publishCmsPage(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const page = await db.select().from(cmsPages).where(eq(cmsPages.id, id)).limit(1);
  if (!page[0]) return false;
  await db.update(cmsPages).set({ publishedData: page[0].draftData, publishedVisible: page[0].draftVisible, workflowStatus: "published", publishedBy: userId, publishedAt: new Date(), archivedAt: null }).where(eq(cmsPages.id, id));
  return true;
}

export async function listCmsMediaAssets() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cmsMediaAssets).orderBy(desc(cmsMediaAssets.createdAt));
}

export async function createCmsMediaAsset(input: typeof cmsMediaAssets.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(cmsMediaAssets).values(input);
  return Number(result[0].insertId);
}

export async function updateCmsMediaAsset(id: number, input: Partial<typeof cmsMediaAssets.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(cmsMediaAssets).set(input).where(eq(cmsMediaAssets.id, id));
}

export async function reviewCmsMediaAsset(id: number, userId: number, approved: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(cmsMediaAssets).set({ workflowStatus: approved ? "approved" : "draft", reviewedBy: userId, reviewedAt: new Date() }).where(eq(cmsMediaAssets.id, id));
}

export async function publishCmsMediaAsset(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(cmsMediaAssets).set({ workflowStatus: "published", publishedBy: userId, publishedAt: new Date() }).where(eq(cmsMediaAssets.id, id));
}

export async function listSiteStats() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteStats).orderBy(siteStats.displayOrder);
}

export async function listPublishedSiteStats() {
  const db = await getDb();
  if (!db) return [];
  return db.select({ metricKey: siteStats.metricKey, value: siteStats.publishedValue, label: siteStats.publishedLabel, description: siteStats.publishedDescription, visible: siteStats.publishedVisible, displayOrder: siteStats.displayOrder }).from(siteStats).where(eq(siteStats.publishedVisible, true)).orderBy(siteStats.displayOrder);
}

export async function updateSiteStat(id: number, input: Partial<typeof siteStats.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(siteStats).set(input).where(eq(siteStats.id, id));
}

export async function publishSiteStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const rows = await listSiteStats();
  for (const row of rows) await db.update(siteStats).set({ publishedValue: row.draftValue, publishedLabel: row.draftLabel, publishedDescription: row.draftDescription, publishedVisible: row.draftVisible, publishedBy: userId, publishedAt: new Date() }).where(eq(siteStats.id, row.id));
}

export async function listProductBrands(visibleOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (visibleOnly) return db.select().from(productBrands).where(eq(productBrands.isVisible, true)).orderBy(productBrands.displayOrder, productBrands.name);
  return db.select().from(productBrands).orderBy(productBrands.displayOrder, productBrands.name);
}

export async function listProductMenuItems(visibleOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (visibleOnly) return db.select().from(productMenuItems).where(eq(productMenuItems.isVisible, true)).orderBy(productMenuItems.displayOrder, productMenuItems.label);
  return db.select().from(productMenuItems).orderBy(productMenuItems.displayOrder, productMenuItems.label);
}

export async function upsertProductBrand(input: typeof productBrands.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (input.id) {
    const { id, ...data } = input;
    await db.update(productBrands).set(data).where(eq(productBrands.id, id));
    return id;
  }
  const result = await db.insert(productBrands).values(input);
  return Number(result[0].insertId);
}

export async function upsertProductMenuItem(input: typeof productMenuItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (input.id) {
    const { id, ...data } = input;
    await db.update(productMenuItems).set(data).where(eq(productMenuItems.id, id));
    return id;
  }
  const result = await db.insert(productMenuItems).values(input);
  return Number(result[0].insertId);
}

export async function deleteProductMenuItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(productMenuItems).where(eq(productMenuItems.id, id));
}

export async function listSparePartBrands(visibleOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (visibleOnly) return db.select().from(sparePartBrands).where(eq(sparePartBrands.isVisible, true)).orderBy(sparePartBrands.displayOrder, sparePartBrands.name);
  return db.select().from(sparePartBrands).orderBy(sparePartBrands.displayOrder, sparePartBrands.name);
}

export async function getSparePartBrandBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(sparePartBrands).where(eq(sparePartBrands.slug, slug)).limit(1);
  return rows[0];
}

export async function upsertSparePartBrand(input: typeof sparePartBrands.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (input.id) {
    const { id, ...data } = input;
    await db.update(sparePartBrands).set(data).where(eq(sparePartBrands.id, id));
    return id;
  }
  const result = await db.insert(sparePartBrands).values(input);
  return Number(result[0].insertId);
}

export async function listSpareParts(brandId?: number, visibleOnly = false) {
  const db = await getDb();
  if (!db) return [];
  if (brandId) {
    if (visibleOnly) return db.select().from(spareParts).where(and(eq(spareParts.brandId, brandId), eq(spareParts.isVisible, true))).orderBy(spareParts.displayOrder, spareParts.name);
    return db.select().from(spareParts).where(eq(spareParts.brandId, brandId)).orderBy(spareParts.displayOrder, spareParts.name);
  }
  if (visibleOnly) return db.select().from(spareParts).where(eq(spareParts.isVisible, true)).orderBy(spareParts.displayOrder, spareParts.name);
  return db.select().from(spareParts).orderBy(spareParts.displayOrder, spareParts.name);
}

export async function upsertSparePart(input: typeof spareParts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  if (input.id) {
    const { id, ...data } = input;
    await db.update(spareParts).set(data).where(eq(spareParts.id, id));
    return id;
  }
  const result = await db.insert(spareParts).values(input);
  return Number(result[0].insertId);
}

export async function deleteSparePart(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.delete(spareParts).where(eq(spareParts.id, id));
}

export async function createDocumentRequest(input: Omit<typeof documentRequests.$inferInsert, "id" | "publicNumber" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const publicNumber = `DOC-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const result = await db.insert(documentRequests).values({ ...input, publicNumber });
  return { id: Number(result[0].insertId), publicNumber };
}

export async function listDocumentRequests() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documentRequests).orderBy(desc(documentRequests.createdAt));
}

export async function updateDocumentRequestStatus(id: number, status: "pending" | "approved" | "rejected" | "sent", reviewedBy: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.update(documentRequests).set({
    status,
    reviewedBy,
    reviewedAt: new Date(),
    sentAt: status === "approved" || status === "sent" ? new Date() : null,
  }).where(eq(documentRequests.id, id));
}
