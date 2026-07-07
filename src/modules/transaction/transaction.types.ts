import { TransactionSchema } from "../../db/schema.js";
import z, { number } from "zod";


export const DepositMoneySchema = TransactionSchema.pick({
    transaction_amount: true,
    sender_account_id: true
})

export interface SendMoneySchema {
    senderAccountNo: string;
    receiverAccountNo: string;
    amount: string
}

export interface CreditMoneySchema {
    accountNo: number,
    amount: string
}

export type DepositMoneyType = z.infer<typeof DepositMoneySchema>