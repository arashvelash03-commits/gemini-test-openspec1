DROP INDEX "idx_users_unique_phone";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "national_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;