CREATE TYPE "public"."endgame_mode" AS ENUM('death-match', 'creature-nest', 'demon-king', 'supreme-deity');--> statement-breakpoint
CREATE TYPE "public"."strategy_status" AS ENUM('PUBLISHED', 'IN_REVIEW', 'REJECTED');--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'STRATEGY_PUBLISHED';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE 'STRATEGY_REJECTED';--> statement-breakpoint
CREATE TABLE "post_strategies" (
	"post_id" uuid PRIMARY KEY NOT NULL,
	"game_id" uuid NOT NULL,
	"mode" "endgame_mode" NOT NULL,
	"target" text DEFAULT '' NOT NULL,
	"level" integer,
	"transcendent" boolean DEFAULT false NOT NULL,
	"team" jsonb NOT NULL,
	"artifact_set" text,
	"phases" jsonb NOT NULL,
	"auto_title" boolean DEFAULT false NOT NULL,
	"status" "strategy_status" NOT NULL,
	"reviewer_id" uuid,
	"reviewed_at" timestamp with time zone,
	"review_note" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_strategies" ADD CONSTRAINT "post_strategies_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_strategies" ADD CONSTRAINT "post_strategies_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_strategies" ADD CONSTRAINT "post_strategies_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_strategies_lookup_idx" ON "post_strategies" USING btree ("game_id","mode","target","status");--> statement-breakpoint
CREATE INDEX "post_strategies_status_idx" ON "post_strategies" USING btree ("status","submitted_at");