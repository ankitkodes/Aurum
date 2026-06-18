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
import { DeleteProfileService, LoginService, ProfileService, RegisterService, UpdateProfileService } from "./user.service.js";
import { UserLogin } from "./user.types.js";
export const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield UserSchema.parse(req.body);
        const result = yield RegisterService(data);
        return res.status(result.Status).json({ message: result.message });
    }
    catch (error) {
        return res.status(400).json({ message: "some Invalid error has occured" });
    }
});
export const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logindata = yield UserLogin.parse(req.body);
        const result = yield LoginService(logindata);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(400).json({ message: "Unable to Login!" });
    }
});
export const Profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield ProfileService(userId);
        return res.status(result.status).json({ message: result.message, user: result.user });
    }
    catch (error) {
        return res.status(400).json({ message: "Some Invalid Error occured!" });
    }
});
export const UpdateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield UserSchema.parse(req.body);
        const result = yield UpdateProfileService(userId, data);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(201).json({ message: "Some Invalid Error has Occured!" });
    }
});
export const DeleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield DeleteProfileService(userId);
        console.log("the value of result:- ", result);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(400).json({ message: "Unable to delete profile" });
    }
});
