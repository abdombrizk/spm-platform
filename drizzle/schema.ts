import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/mysql-core";

export const userRoles = ["owner", "manager", "marketing", "sales", "service", "qa", "ra", "user"] as const;
export type UserRole = typeof userRoles[number];

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 128 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }).default("internal").notNull(),
  role: mysqlEnum("role", userRoles).default("marketing").notNull(),
  passwordHash: text("passwordHash"),
  mustChangePassword: boolean("mustChangePassword").default(true).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  failedLoginAttempts: int("failedLoginAttempts").default(0).notNull(),
  lockedUntil: timestamp("lockedUntil"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export const internalSessions = mysqlTable("internal_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tokenHash: varchar("tokenHash", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userIdx: index("internal_sessions_user_idx").on(table.userId) }));

export const userPermissions = mysqlTable("user_permissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  permission: varchar("permission", { length: 128 }).notNull(),
  granted: boolean("granted").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ userPermissionIdx: index("user_permissions_user_idx").on(table.userId) }));

export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId"),
  action: varchar("action", { length: 128 }).notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: varchar("entityId", { length: 128 }),
  metadata: text("metadata"),
  ipAddress: varchar("ipAddress", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ auditActorIdx: index("audit_logs_actor_idx").on(table.actorUserId) }));

export const homepageContent = mysqlTable("homepage_content", {
  id: int("id").autoincrement().primaryKey(),
  contentKey: varchar("contentKey", { length: 128 }).notNull().unique(),
  contentType: mysqlEnum("contentType", ["text", "image", "url", "number"]).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  draftValue: text("draftValue").notNull(),
  publishedValue: text("publishedValue").notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  publishedVisible: boolean("publishedVisible").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedBy: int("updatedBy"),
  publishedBy: int("publishedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  productType: mysqlEnum("productType", ["medical_device", "spare_part", "accessory"]).notNull(),
  draftData: text("draftData").notNull(),
  publishedData: text("publishedData").notNull(),
  draftVisible: boolean("draftVisible").default(true).notNull(),
  publishedVisible: boolean("publishedVisible").default(true).notNull(),
  workflowStatus: mysqlEnum("workflowStatus", ["draft", "published", "archived"]).default("draft").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  publishedBy: int("publishedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
  archivedAt: timestamp("archivedAt"),
});

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  serviceType: mysqlEnum("serviceType", ["installation", "commissioning", "preventive_maintenance", "corrective_maintenance", "emergency_maintenance", "calibration", "technical_support", "training", "spare_parts_supply", "maintenance_contract"]).notNull(),
  draftData: text("draftData").notNull(),
  publishedData: text("publishedData").notNull(),
  draftVisible: boolean("draftVisible").default(true).notNull(),
  publishedVisible: boolean("publishedVisible").default(true).notNull(),
  workflowStatus: mysqlEnum("workflowStatus", ["draft", "pending_review", "approved", "published", "archived"]).default("draft").notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  reviewedBy: int("reviewedBy"),
  publishedBy: int("publishedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  publishedAt: timestamp("publishedAt"),
  archivedAt: timestamp("archivedAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InternalSession = typeof internalSessions.$inferSelect;
export type UserPermission = typeof userPermissions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type HomepageContent = typeof homepageContent.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Service = typeof services.$inferSelect;

export const quoteStatuses = ["new", "under_review", "assigned_to_sales", "preparing_quotation", "sent_to_customer", "customer_responded", "waiting_for_customer", "waiting_for_technical_review", "waiting_for_supplier", "on_hold", "won", "lost", "closed", "cancelled"] as const;
export const quotePriorities = ["low", "normal", "high", "urgent"] as const;
export const quoteItemTypes = ["product", "service", "custom"] as const;
export const quoteRequesterTypes = ["doctor", "biomedical_engineer", "technician", "procurement_officer", "hospital", "clinic", "medical_center", "distributor", "private_company", "government_entity", "individual", "other"] as const;

export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  publicNumber: varchar("publicNumber", { length: 40 }).notNull().unique(),
  publicAccessToken: varchar("publicAccessToken", { length: 80 }).unique(),
  customerAccountId: int("customerAccountId"),
  organizationName: varchar("organizationName", { length: 255 }),
  requesterType: mysqlEnum("requesterType", quoteRequesterTypes),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  jobTitle: varchar("jobTitle", { length: 180 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 80 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 80 }),
  preferredContactMethod: mysqlEnum("preferredContactMethod", ["email", "phone", "whatsapp", "any"]).default("any").notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  city: varchar("city", { length: 160 }),
  address: text("address"),
  requiredDeliveryDate: varchar("requiredDeliveryDate", { length: 40 }),
  installationRequired: mysqlEnum("installationRequired", ["yes", "no", "not_sure"]).default("not_sure").notNull(),
  trainingRequired: mysqlEnum("trainingRequired", ["yes", "no", "not_sure"]).default("not_sure").notNull(),
  maintenanceContractRequired: mysqlEnum("maintenanceContractRequired", ["yes", "no", "not_sure"]).default("not_sure").notNull(),
  message: text("message"),
  status: mysqlEnum("status", quoteStatuses).default("new").notNull(),
  priority: mysqlEnum("priority", quotePriorities).default("normal").notNull(),
  assignedSalesUserId: int("assignedSalesUserId"),
  assignedServiceUserId: int("assignedServiceUserId"),
  source: mysqlEnum("source", ["website", "product_page", "service_page", "whatsapp", "email", "manual", "campaign"]).default("website").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  closedAt: timestamp("closedAt"),
});

export const quoteItems = mysqlTable("quote_items", {
  id: int("id").autoincrement().primaryKey(),
  quoteRequestId: int("quoteRequestId").notNull(),
  itemType: mysqlEnum("itemType", quoteItemTypes).notNull(),
  productId: int("productId"),
  serviceId: int("serviceId"),
  itemName: varchar("itemName", { length: 255 }).notNull(),
  quantity: int("quantity").default(1).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quoteAttachments = mysqlTable("quote_attachments", {
  id: int("id").autoincrement().primaryKey(),
  quoteRequestId: int("quoteRequestId").notNull(),
  uploadedBy: int("uploadedBy"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  contentType: varchar("contentType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  storageUrl: text("storageUrl").notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const quoteComments = mysqlTable("quote_comments", {
  id: int("id").autoincrement().primaryKey(),
  quoteRequestId: int("quoteRequestId").notNull(),
  userId: int("userId").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const serviceRequestTypes = ["corrective_maintenance", "preventive_maintenance", "emergency_maintenance", "installation", "commissioning", "calibration", "technical_support", "spare_parts", "training", "maintenance_contract", "other"] as const;
export const serviceRequestStatuses = ["new", "under_review", "assigned", "waiting_for_customer", "remote_diagnosis", "site_visit_required", "quotation_required", "awaiting_approval", "scheduled", "in_progress", "waiting_for_parts", "resolved", "customer_confirmation", "closed", "cancelled"] as const;
export const serviceRequestPriorities = ["low", "normal", "high", "urgent"] as const;
export const serviceRequestRequesterTypes = quoteRequesterTypes;
export const serviceRequestWarrantyStatuses = ["under_warranty", "out_of_warranty", "unknown"] as const;
export const serviceRequestOperationalStatuses = ["yes", "partially", "no", "unknown"] as const;
export const serviceRequestOccurrencePatterns = ["continuous", "intermittent", "unknown"] as const;
export const serviceRequestSafeStatuses = ["yes", "no", "unknown"] as const;

export const serviceRequests = mysqlTable("service_requests", {
  id: int("id").autoincrement().primaryKey(),
  publicNumber: varchar("publicNumber", { length: 40 }).notNull().unique(),
  publicAccessToken: varchar("publicAccessToken", { length: 80 }).notNull().unique(),
  quoteRequestId: int("quoteRequestId"),
  serviceId: int("serviceId"),
  requestType: mysqlEnum("requestType", serviceRequestTypes).notNull().default("other"),
  organizationName: varchar("organizationName", { length: 255 }),
  requesterType: mysqlEnum("requesterType", serviceRequestRequesterTypes),
  contactPerson: varchar("contactPerson", { length: 255 }).notNull(),
  jobTitle: varchar("jobTitle", { length: 180 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 80 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 80 }),
  preferredContactMethod: mysqlEnum("preferredContactMethod", ["email", "phone", "whatsapp", "any"]).default("any").notNull(),
  country: varchar("country", { length: 120 }).notNull(),
  city: varchar("city", { length: 160 }),
  address: text("address"),
  visitRequired: mysqlEnum("visitRequired", ["yes", "no", "not_sure"]).default("not_sure").notNull(),
  preferredVisitDate: varchar("preferredVisitDate", { length: 40 }),
  preferredVisitTime: varchar("preferredVisitTime", { length: 80 }),
  siteAccessNotes: text("siteAccessNotes"),
  safetyAcknowledged: boolean("safetyAcknowledged").default(false).notNull(),
  noPatientDataAcknowledged: boolean("noPatientDataAcknowledged").default(false).notNull(),
  status: mysqlEnum("status", serviceRequestStatuses).default("new").notNull(),
  priority: mysqlEnum("priority", serviceRequestPriorities).default("normal").notNull(),
  assignedServiceUserId: int("assignedServiceUserId"),
  assignedSalesUserId: int("assignedSalesUserId"),
  source: mysqlEnum("source", ["website", "product_page", "service_page", "whatsapp", "email", "manual", "campaign"]).default("website").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  closedAt: timestamp("closedAt"),
});

export const serviceRequestEquipment = mysqlTable("service_request_equipment", {
  id: int("id").autoincrement().primaryKey(),
  serviceRequestId: int("serviceRequestId").notNull(),
  productId: int("productId"),
  equipmentCategory: varchar("equipmentCategory", { length: 160 }).notNull(),
  manufacturer: varchar("manufacturer", { length: 255 }),
  model: varchar("model", { length: 180 }),
  serialNumber: varchar("serialNumber", { length: 180 }),
  assetNumber: varchar("assetNumber", { length: 180 }),
  installationYear: int("installationYear"),
  lastMaintenanceDate: varchar("lastMaintenanceDate", { length: 40 }),
  warrantyStatus: mysqlEnum("warrantyStatus", serviceRequestWarrantyStatuses).default("unknown").notNull(),
  equipmentLocation: varchar("equipmentLocation", { length: 180 }),
  roomDepartment: varchar("roomDepartment", { length: 180 }),
  deviceAddress: text("deviceAddress"),
  operationalStatus: mysqlEnum("operationalStatus", serviceRequestOperationalStatuses).default("unknown").notNull(),
  problemTitle: varchar("problemTitle", { length: 255 }).notNull(),
  problemDescription: text("problemDescription").notNull(),
  errorCode: varchar("errorCode", { length: 255 }),
  alarmMessage: text("alarmMessage"),
  problemStartedAt: varchar("problemStartedAt", { length: 120 }),
  occurrencePattern: mysqlEnum("occurrencePattern", serviceRequestOccurrencePatterns).default("unknown").notNull(),
  precedingEvent: varchar("precedingEvent", { length: 180 }),
  safeToUse: mysqlEnum("safeToUse", serviceRequestSafeStatuses).default("unknown").notNull(),
  previousMaintenance: text("previousMaintenance"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const serviceRequestAttachments = mysqlTable("service_request_attachments", {
  id: int("id").autoincrement().primaryKey(),
  serviceRequestId: int("serviceRequestId").notNull(),
  equipmentId: int("equipmentId"),
  uploadedBy: int("uploadedBy"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  contentType: varchar("contentType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  storageUrl: text("storageUrl").notNull(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const serviceRequestComments = mysqlTable("service_request_comments", {
  id: int("id").autoincrement().primaryKey(),
  serviceRequestId: int("serviceRequestId").notNull(),
  userId: int("userId").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const cmsPageStatuses = ["draft", "pending_review", "approved", "published", "archived"] as const;
export const cmsPageTypes = ["about", "maintenance_contracts", "faqs", "downloads", "news", "events", "careers", "spare_parts", "resources", "contact", "privacy", "terms"] as const;

export const cmsPages = mysqlTable("cms_pages", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  pageType: mysqlEnum("pageType", cmsPageTypes).notNull(),
  draftData: text("draftData").notNull(),
  publishedData: text("publishedData").notNull(),
  draftVisible: boolean("draftVisible").default(true).notNull(),
  publishedVisible: boolean("publishedVisible").default(true).notNull(),
  workflowStatus: mysqlEnum("workflowStatus", cmsPageStatuses).default("draft").notNull(),
  requiresQaReview: boolean("requiresQaReview").default(false).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  reviewedBy: int("reviewedBy"),
  publishedBy: int("publishedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  publishedAt: timestamp("publishedAt"),
  archivedAt: timestamp("archivedAt"),
});

export const cmsAssetTypes = ["website_image", "product_image", "service_image", "certificate", "ce_document", "quality_document", "agency_letter", "customer_letter", "brochure", "technical_file", "other"] as const;
export const cmsAssetStatuses = ["draft", "pending_review", "approved", "published", "archived"] as const;

export const cmsMediaAssets = mysqlTable("cms_media_assets", {
  id: int("id").autoincrement().primaryKey(),
  fileKey: varchar("fileKey", { length: 500 }).notNull().unique(),
  storageUrl: text("storageUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  contentType: varchar("contentType", { length: 120 }).notNull(),
  sizeBytes: int("sizeBytes").notNull(),
  assetType: mysqlEnum("assetType", cmsAssetTypes).default("other").notNull(),
  altText: varchar("altText", { length: 500 }).default("").notNull(),
  caption: varchar("caption", { length: 500 }).default("").notNull(),
  description: text("description"),
  visibility: mysqlEnum("visibility", ["public", "internal"]).default("internal").notNull(),
  isTemporary: boolean("isTemporary").default(false).notNull(),
  workflowStatus: mysqlEnum("workflowStatus", cmsAssetStatuses).default("draft").notNull(),
  linkedPageSlug: varchar("linkedPageSlug", { length: 180 }),
  uploadedBy: int("uploadedBy"),
  reviewedBy: int("reviewedBy"),
  publishedBy: int("publishedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
  publishedAt: timestamp("publishedAt"),
  archivedAt: timestamp("archivedAt"),
});

export const siteStats = mysqlTable("site_stats", {
  id: int("id").autoincrement().primaryKey(),
  metricKey: varchar("metricKey", { length: 120 }).notNull().unique(),
  draftValue: varchar("draftValue", { length: 120 }).notNull(),
  publishedValue: varchar("publishedValue", { length: 120 }).notNull(),
  draftLabel: varchar("draftLabel", { length: 255 }).notNull(),
  publishedLabel: varchar("publishedLabel", { length: 255 }).notNull(),
  draftDescription: text("draftDescription"),
  publishedDescription: text("publishedDescription"),
  draftVisible: boolean("draftVisible").default(true).notNull(),
  publishedVisible: boolean("publishedVisible").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  updatedBy: int("updatedBy"),
  publishedBy: int("publishedBy"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type CmsPage = typeof cmsPages.$inferSelect;
export type CmsMediaAsset = typeof cmsMediaAssets.$inferSelect;
export type SiteStat = typeof siteStats.$inferSelect;

export const productBrands = mysqlTable("product_brands", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: text("logoUrl"),
  menuImageUrl: text("menuImageUrl"),
  websiteUrl: text("websiteUrl"),
  authorizedAgentLabel: varchar("authorizedAgentLabel", { length: 255 }),
  isVisible: boolean("isVisible").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const productMenuItems = mysqlTable("product_menu_items", {
  id: int("id").autoincrement().primaryKey(),
  brandId: int("brandId"),
  productId: int("productId"),
  parentId: int("parentId"),
  label: varchar("label", { length: 255 }).notNull(),
  href: varchar("href", { length: 500 }).notNull(),
  imageUrl: text("imageUrl"),
  iconName: varchar("iconName", { length: 80 }),
  itemType: mysqlEnum("itemType", ["brand", "category", "product", "view_all", "custom"]).default("custom").notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const sparePartBrands = mysqlTable("spare_part_brands", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  introduction: text("introduction"),
  logoUrl: text("logoUrl"),
  heroImageUrl: text("heroImageUrl"),
  authorizedAgentLabel: varchar("authorizedAgentLabel", { length: 255 }),
  authorizationDocumentUrl: text("authorizationDocumentUrl"),
  isVisible: boolean("isVisible").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const spareParts = mysqlTable("spare_parts", {
  id: int("id").autoincrement().primaryKey(),
  brandId: int("brandId"),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  partNumber: varchar("partNumber", { length: 180 }),
  equipmentCategory: varchar("equipmentCategory", { length: 180 }),
  description: text("description"),
  imageUrl: text("imageUrl"),
  availabilityStatus: mysqlEnum("availabilityStatus", ["available", "on_request", "discontinued", "coming_soon"]).default("on_request").notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  createdBy: int("createdBy"),
  updatedBy: int("updatedBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const documentRequestStatuses = ["pending", "approved", "rejected", "sent"] as const;
export const documentRequestTypes = ["brochure", "datasheet", "user_manual", "regulatory_document", "technical_file", "other"] as const;

export const documentRequests = mysqlTable("document_requests", {
  id: int("id").autoincrement().primaryKey(),
  publicNumber: varchar("publicNumber", { length: 40 }).notNull().unique(),
  productId: int("productId"),
  documentType: mysqlEnum("documentType", documentRequestTypes).notNull(),
  documentUrl: text("documentUrl"),
  documentName: varchar("documentName", { length: 255 }),
  downloadTokenHash: varchar("downloadTokenHash", { length: 128 }).unique(),
  downloadExpiresAt: timestamp("downloadExpiresAt"),
  downloadedAt: timestamp("downloadedAt"),
  requesterName: varchar("requesterName", { length: 255 }).notNull(),
  requesterEmail: varchar("requesterEmail", { length: 320 }).notNull(),
  requesterOrganization: varchar("requesterOrganization", { length: 255 }),
  message: text("message"),
  status: mysqlEnum("status", documentRequestStatuses).default("pending").notNull(),
  reviewedBy: int("reviewedBy"),
  reviewedAt: timestamp("reviewedAt"),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProductBrand = typeof productBrands.$inferSelect;
export type ProductMenuItem = typeof productMenuItems.$inferSelect;
export type SparePartBrand = typeof sparePartBrands.$inferSelect;
export type SparePart = typeof spareParts.$inferSelect;
export type DocumentRequest = typeof documentRequests.$inferSelect;
