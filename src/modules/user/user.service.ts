import { DeleteProfileRepository, LoginRespository, ProfileRepository, RegisterRepository, UpdateProfileRespository } from "./user.repository.js";
import { UserLoginSchema, UserRegistrationSchema } from "./user.types.js";

export const RegisterService = async (userData: UserRegistrationSchema) => {
    return await RegisterRepository(userData);
}

export const LoginService = async (logindata: UserLoginSchema) => {
    return await LoginRespository(logindata);
}

export const ProfileService = async (userId: string) => {
    return await ProfileRepository(userId);
}

export const UpdateProfileService = async (userId: string, data: UserRegistrationSchema) => {
    return await UpdateProfileRespository(userId, data);
}

export const DeleteProfileService = async (userId: string) => {
    return await DeleteProfileRepository(userId);
}