import { UserSchema } from "../../db/schema.js";
export const UserLogin = UserSchema.pick({
    phoneNo: true,
    password: true,
});
