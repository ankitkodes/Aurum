CREATE TABLE "ledger_system" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"transaction_id" uuid NOT NULL,
	"sender_account_id" uuid NOT NULL,
	"receiver_account_id" uuid NOT NULL,
	"type" "transaction_type_enums" DEFAULT 'Credit',
	"amount" numeric(15, 2) NOT NULL,
	"balance" numeric(15, 2) NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "ledger_system" ADD CONSTRAINT "ledger_system_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_system" ADD CONSTRAINT "ledger_system_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_system" ADD CONSTRAINT "ledger_system_sender_account_id_account_id_fk" FOREIGN KEY ("sender_account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_system" ADD CONSTRAINT "ledger_system_receiver_account_id_account_id_fk" FOREIGN KEY ("receiver_account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;