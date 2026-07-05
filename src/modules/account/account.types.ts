import z from "zod";
import { AccountSchema } from "../../db/schema.js";


export const AccountRegister = AccountSchema.pick({
    category: true,
    balance: true,
})

export type AccountRegisterSchema = z.infer<typeof AccountRegister>;
