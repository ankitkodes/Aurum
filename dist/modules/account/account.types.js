import { AccountSchema } from "../../db/schema.js";
export const AccountRegister = AccountSchema.pick({
    category: true,
    balance: true,
    user_id: true
});
