import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
  date,
  jsonb,
  integer,
  primaryKey,
  foreignKey,
  index,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const userRoleEnum = pgEnum("user_role", ["doctor", "clerk", "patient", "admin"]);
export const fhirGenderEnum = pgEnum("fhir_gender", ["male", "female", "other", "unknown"]);
export const fhirStatusEnum = pgEnum("fhir_status", ["active", "inactive", "error"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nationalCode: text("national_code").unique().notNull(),
  phoneNumber: text("phone_number"),
  passwordHash: text("password_hash"),
  createdBy: uuid("created_by"),
  role: userRoleEnum("role").default("patient").notNull(),
  fullName: text("full_name"),
  gender: fhirGenderEnum("gender"),
  birthDate: date("birth_date"),
  status: fhirStatusEnum("status").default("active"),
  resourceType: text("resource_type").notNull(),
  fhirData: jsonb("fhir_data").default({}).notNull(),
  totpSecret: text("totp_secret"),
  totpEnabled: boolean("totp_enabled").default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull().$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
}, (table) => {
  return {
    createdByReference: foreignKey({
      columns: [table.createdBy],
      foreignColumns: [table.id],
      name: "users_created_by_fkey"
    }),
  };
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull().$onUpdate(() => new Date()),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: uuid("resource_id"),
  details: jsonb("details").default({}),
  actorDetails: jsonb("actor_details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  occurredAt: timestamp("occurred_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
}, (table) => ({
  actorIdx: index("audit_logs_actor_idx").on(table.actorUserId),
}));
