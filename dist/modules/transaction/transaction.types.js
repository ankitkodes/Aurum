import { TransactionSchema } from "../../db/schema.js";
export const DepositMoneySchema = TransactionSchema.pick({
    transaction_amount: true,
    sender_account_id: true
});
