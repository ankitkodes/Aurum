var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserSchema } from "../../db/schema.js";
import { ValidationError } from "../../errors/validation/ValidationError.js";
import { asyncHander } from "../../shared/handler/asyncHandler.js";
import { DeleteProfileService, LoginService, ProfileService, RegisterService, UpdateProfileService } from "./user.service.js";
import { UserLogin } from "./user.types.js";
export const Register = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const data = result.data;
    const response = yield RegisterService(data);
    return res.status(response.status).json({ message: response.message });
}));
export const Login = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = UserLogin.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const logindata = result.data;
    const loginResult = yield LoginService(logindata);
    if (!loginResult) {
        return res.status(500).json({ message: "Unable to Login!" });
    }
    return res.status(loginResult.status).json({ message: loginResult.message, token: loginResult.token });
}));
export const Profile = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield ProfileService(userId);
    return res.status(result.status).json({ message: result.message, user: result.user });
}));
export const UpdateProfile = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = UserSchema.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const data = result.data;
    const response = yield UpdateProfileService(userId, data);
    return res.status(response.status).json({ message: response.message });
}));
export const DeleteProfile = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield DeleteProfileService(userId);
    return res.status(result.status).json({ message: result.message });
}));
