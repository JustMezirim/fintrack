ALTER TABLE "accounts" ADD COLUMN "plaid_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "paid_id";