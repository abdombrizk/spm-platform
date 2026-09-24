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

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type InternalSession = typeof internalSessions.$inferSelect;
export type UserPermission = typeof userPermissions.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type HomepageContent = typeof homepageContent.$inferSelect;
