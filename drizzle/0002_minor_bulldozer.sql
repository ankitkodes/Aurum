DROP INDEX "account_id";--> statement-breakpoint
CREATE INDEX "sender_account_id" ON "transaction" USING btree ("sender_account_id");--> statement-breakpoint
CREATE INDEX "receiver_account_id" ON "transaction" USING btree ("receiver_account_id");