var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DeleteProfileRepository, LoginRespository, ProfileRepository, RegisterRepository, UpdateProfileRespository } from "./user.repository.js";
export const RegisterService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield RegisterRepository(userData);
});
export const LoginService = (logindata) => __awaiter(void 0, void 0, void 0, function* () {
    return yield LoginRespository(logindata);
});
export const ProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ProfileRepository(userId);
});
export const UpdateProfileService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield UpdateProfileRespository(userId, data);
});
export const DeleteProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield DeleteProfileRepository(userId);
});
