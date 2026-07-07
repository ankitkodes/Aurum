import { UserSchema } from "../../db/schema.js";
import { DeleteProfileService, LoginService, ProfileService, RegisterService, UpdateProfileService } from "./user.service.js";
import { UserLogin, UserLoginSchema, UserRegistrationSchema } from "./user.types.js";


export const Register = async (req: { body: UserRegistrationSchema }, res: any) => {
    try {
        const data = await UserSchema.parse(req.body);
        const result = await RegisterService(data);
        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        return res.status(500).json({ message: "Unable to register user" });
    }
}

export const Login = async (req: { body: UserLoginSchema }, res: any) => {
    try {
        const logindata = await UserLogin.parse(req.body);
        const result = await LoginService(logindata);
        if (!result) {
            return res.status(500).json({ message: "Unable to Login!" });
        }
        return res.status(result.status).json({ message: result.message, token: result.token });
    } catch (error) {
        return res.status(500).json({ message: "Unable to Login!" });
    }
}

export const Profile = async (req: { params: { userId: string } }, res: any) => {
    try {
        const { userId } = req.params;
        const result = await ProfileService(userId);
        return res.status(result.status).json({ message: result.message, user: result.user });
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch profile" })
    }
}

export const UpdateProfile = async (req: { body: UserRegistrationSchema; params: { userId: string } }, res: any) => {
    try {
        const { userId } = req.params;
        const data = await UserSchema.parse(req.body);
        const result = await UpdateProfileService(userId, data);
        return res.status(result.status).json({ message: result.message })

    } catch (error) {
        return res.status(500).json({ message: "Unable to update profile" })
    }
}

export const DeleteProfile = async (req: { params: { userId: string } }, res: any) => {
    try {
        const { userId } = req.params;
        const result = await DeleteProfileService(userId);
        return res.status(result.status).json({ message: result.message });

    } catch (error) {
        return res.status(500).json({ message: "Unable to delete profile" })
    }
}