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
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const userRoleEnum = pgEnum("user_role", ["doctor", "clerk", "patient", "admin"]);
export const fhirGenderEnum = pgEnum("fhir_gender", ["male", "female", "other", "unknown"]);
export const fhirStatusEnum = pgEnum("fhir_status", ["active", "inactive", "error"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  nationalCode: text("national_code").unique().notNull(), // Made notNull as it's the primary unique ID
  phoneNumber: text("phone_number"), // Not unique
  passwordHash: text("password_hash"),
  createdBy: uuid("created_by"),
  role: userRoleEnum("role").default("patient").notNull(),
  fullName: text("full_name"),
  gender: fhirGenderEnum("gender"),
  birthDate: date("birth_date"),
  status: fhirStatusEnum("status").default("active"),
  resourceType: text("resource_type").notNull(), // CHECK constraint not directly supported in column def
  fhirData: jsonb("fhir_data").default({}).notNull(),
  totpSecret: text("totp_secret"),
  totpEnabled: boolean("totp_enabled").default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
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
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
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
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
