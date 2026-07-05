var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreateAccountService, DeleteAccountService, GetAccountDetailsService, GetUserAllAccountService } from "./account.service.js";
import { AccountRegister } from "./account.types.js";
export const CreateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield AccountRegister.parse(req.body);
        const result = yield CreateAccountService(data, userId);
        if (!result) {
            return res.status(302).json({ message: "Some problem occured create after sometimes" });
        }
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        console.log("controller values:- ", error);
        return res.status(201).json({ message: "unable to create Account" });
    }
});
export const GetAccountDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId } = req.params;
        const result = yield GetAccountDetailsService(accountId);
        return res.status(result.status).json({ message: result.message, account: result.account });
    }
    catch (error) {
        return res.status(302).json({ message: "Unable to fetdetails , Try again later!" });
    }
});
export const GetUserAllAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield GetUserAllAccountService(userId);
        return res.status(result.status).json({ message: result.message, account: result.account });
    }
    catch (error) {
        return res.status(403).json({ message: "unable to fetch user all account" });
    }
});
export const DeleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId } = req.params;
        const result = yield DeleteAccountService(accountId);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(203).json({ message: "some invalid Error has occured!" });
    }
});
