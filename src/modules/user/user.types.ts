import z from "zod";
import { UserSchema } from "../../db/schema.js";


export const UserLogin = UserSchema.pick({
    phoneNo: true,
    password: true,
});

export type UserLoginSchema = z.infer<typeof UserLogin>;
export type UserRegistrationSchema = z.infer<typeof UserSchema>;