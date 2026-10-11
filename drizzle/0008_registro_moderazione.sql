CREATE TYPE "public"."mod_target" AS ENUM('POST', 'COMMENT', 'GUIDE', 'BUILD', 'USER', 'SPONSOR', 'VERIFICATION', 'STRATEGY');--> statement-breakpoint
ALTER TABLE "mod_actions" ALTER COLUMN "target_type" SET DATA TYPE "public"."mod_target" USING "target_type"::text::"public"."mod_target";--> statement-breakpoint
ALTER TABLE "suspensions" ADD COLUMN "lifted_by" uuid;--> statement-breakpoint
ALTER TABLE "suspensions" ADD CONSTRAINT "suspensions_lifted_by_users_id_fk" FOREIGN KEY ("lifted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;