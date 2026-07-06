import z from "zod";
import { AccountSchema } from "../../db/schema.js";


export const AccountRegister = AccountSchema.pick({
    category: true,
    balance: true,
})
export interface SendMoneySchema {
    senderId: string;
    receiverId: string;
    amount: string
}
export type AccountRegisterSchema = z.infer<typeof AccountRegister>;
