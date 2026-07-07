var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreateAccountService, DeleteAccountService, GetAccountDetailsService, GetUserAllAccountService, TransactionHistoryService } from "./account.service.js";
import { AccountRegister } from "./account.types.js";
export const CreateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const data = yield AccountRegister.parse(req.body);
        const result = yield CreateAccountService(data, userId);
        if (!result) {
            return res.status(500).json({ message: "Some problem occured, try again later" });
        }
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        console.log("controller values:- ", error);
        return res.status(500).json({ message: "Unable to create Account" });
    }
});
export const GetAccountDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId } = req.params;
        const result = yield GetAccountDetailsService(accountId);
        return res.status(result.status).json({ message: result.message, account: result.account });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to fetch details, try again later" });
    }
});
export const TransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { accountId } = req.params;
        const result = yield TransactionHistoryService(accountId);
        return res.status(result.status).json({
            message: result.message,
            transactions: (_a = result.transactions) !== null && _a !== void 0 ? _a : []
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to fetch transaction details" });
    }
});
export const GetUserAllAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const result = yield GetUserAllAccountService(userId);
        return res.status(result.status).json({ message: result.message, account: result.account });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to fetch user accounts" });
    }
});
export const DeleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId } = req.params;
        const result = yield DeleteAccountService(accountId);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to delete account" });
    }
});
