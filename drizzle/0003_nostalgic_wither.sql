ALTER TABLE "ledger_system" DROP CONSTRAINT "ledger_system_sender_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "ledger_system" DROP CONSTRAINT "ledger_system_receiver_account_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "ledger_system" DROP COLUMN "sender_account_id";--> statement-breakpoint
ALTER TABLE "ledger_system" DROP COLUMN "receiver_account_id";