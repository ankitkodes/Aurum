import { UserSchema } from "../../db/schema.js";
import { ValidationError } from "../../errors/validation/ValidationError.js";
import { asyncHander } from "../../shared/handler/asyncHandler.js";
import { DeleteProfileService, LoginService, ProfileService, RegisterService, UpdateProfileService } from "./user.service.js";
import { UserLogin, UserLoginSchema, UserRegistrationSchema } from "./user.types.js";


export const Register = asyncHander(async (req: { body: UserRegistrationSchema }, res: any) => {

    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const data = result.data;
    const response = await RegisterService(data);
    return res.status(response.status).json({ message: response.message });
});

export const Login = asyncHander(async (req: { body: UserLoginSchema }, res: any) => {
    const result = UserLogin.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const logindata = result.data;
    const loginResult = await LoginService(logindata);
    if (!loginResult) {
        return res.status(500).json({ message: "Unable to Login!" });
    }
    return res.status(loginResult.status).json({ message: loginResult.message, token: loginResult.token });

})

export const Profile = asyncHander(async (req: { params: { userId: string } }, res: any) => {

    const { userId } = req.params;
    const result = await ProfileService(userId);
    return res.status(result.status).json({ message: result.message, user: result.user });

})

export const UpdateProfile = asyncHander(async (req: { body: UserRegistrationSchema; params: { userId: string } }, res: any) => {

    const { userId } = req.params;
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const data = result.data;
    const response = await UpdateProfileService(userId, data);
    return res.status(response.status).json({ message: response.message })

})

export const DeleteProfile = asyncHander(async (req: { params: { userId: string } }, res: any) => {

    const { userId } = req.params;
    const result = await DeleteProfileService(userId);
    return res.status(result.status).json({ message: result.message });
})