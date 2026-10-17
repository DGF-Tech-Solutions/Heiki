CREATE TABLE "hero_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"hero_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"pve_score" integer NOT NULL,
	"pvp_score" integer NOT NULL,
	"best_content" text,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hero_ratings" ADD CONSTRAINT "hero_ratings_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hero_ratings" ADD CONSTRAINT "hero_ratings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "hero_ratings_user_hero_idx" ON "hero_ratings" USING btree ("game_id","hero_id","user_id");--> statement-breakpoint
CREATE INDEX "hero_ratings_lookup_idx" ON "hero_ratings" USING btree ("game_id","hero_id");--> statement-breakpoint
CREATE INDEX "hero_ratings_user_idx" ON "hero_ratings" USING btree ("user_id");