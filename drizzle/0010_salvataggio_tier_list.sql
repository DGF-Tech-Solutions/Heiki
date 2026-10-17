CREATE TABLE "user_tier_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"game_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"data" jsonb NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_tier_lists" ADD CONSTRAINT "user_tier_lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tier_lists" ADD CONSTRAINT "user_tier_lists_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_tier_lists_user_idx" ON "user_tier_lists" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_tier_lists_game_idx" ON "user_tier_lists" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX "user_tier_lists_updated_idx" ON "user_tier_lists" USING btree ("updated_at");