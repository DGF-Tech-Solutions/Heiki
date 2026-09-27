CREATE TYPE "public"."verification_status" AS ENUM('OPEN', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'POWER_VERIFIED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'POWER_REJECTED';--> statement-breakpoint
CREATE TABLE "power_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"game_account_id" uuid NOT NULL,
	"status" "verification_status" DEFAULT 'OPEN' NOT NULL,
	"challenge_day" text NOT NULL,
	"challenge_hero_id" text NOT NULL,
	"skipped_hero_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"declared_power" integer,
	"screenshot_hash" text,
	"submitted_at" timestamp with time zone,
	"reviewer_id" uuid,
	"reviewed_at" timestamp with time zone,
	"verified_power" integer,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_screenshots" (
	"verification_id" uuid PRIMARY KEY NOT NULL,
	"mime" text NOT NULL,
	"bytes" "bytea" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "game_accounts" ADD COLUMN "account_power" integer;--> statement-breakpoint
ALTER TABLE "game_accounts" ADD COLUMN "setup" jsonb;--> statement-breakpoint
ALTER TABLE "game_accounts" ADD COLUMN "verified_power" integer;--> statement-breakpoint
ALTER TABLE "game_accounts" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "game_accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "verification_id" uuid;--> statement-breakpoint
ALTER TABLE "power_verifications" ADD CONSTRAINT "power_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_verifications" ADD CONSTRAINT "power_verifications_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_verifications" ADD CONSTRAINT "power_verifications_game_account_id_game_accounts_id_fk" FOREIGN KEY ("game_account_id") REFERENCES "public"."game_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_verifications" ADD CONSTRAINT "power_verifications_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_screenshots" ADD CONSTRAINT "verification_screenshots_verification_id_power_verifications_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."power_verifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "power_verifications_status_idx" ON "power_verifications" USING btree ("status","submitted_at");--> statement-breakpoint
CREATE INDEX "power_verifications_user_game_idx" ON "power_verifications" USING btree ("user_id","game_id","created_at");--> statement-breakpoint
CREATE INDEX "power_verifications_hash_idx" ON "power_verifications" USING btree ("screenshot_hash");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_verification_id_power_verifications_id_fk" FOREIGN KEY ("verification_id") REFERENCES "public"."power_verifications"("id") ON DELETE cascade ON UPDATE no action;