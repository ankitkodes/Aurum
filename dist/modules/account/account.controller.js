var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ValidationError } from "../../errors/validation/ValidationError.js";
import { asyncHander } from "../../shared/handler/asyncHandler.js";
import { CreateAccountService, DeleteAccountService, GetAccountDetailsService, GetUserAllAccountService, TransactionHistoryService } from "./account.service.js";
import { AccountRegister } from "./account.types.js";
export const CreateAccount = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = AccountRegister.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError("validation failed");
    }
    const data = result.data;
    const response = yield CreateAccountService(data, userId);
    if (!response) {
        return res.status(500).json({ message: "Some problem occured, try again later" });
    }
    return res.status(response.status).json({ message: response.message });
}));
export const GetAccountDetails = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.params;
    const result = yield GetAccountDetailsService(accountId);
    return res.status(result.status).json({ message: result.message, account: result.account });
}));
export const TransactionHistory = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { accountId } = req.params;
    const result = yield TransactionHistoryService(accountId);
    return res.status(result.status).json({
        message: result.message,
        transactions: (_a = result.transactions) !== null && _a !== void 0 ? _a : []
    });
}));
export const GetUserAllAccount = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const result = yield GetUserAllAccountService(userId);
    return res.status(result.status).json({ message: result.message, account: result.account });
}));
export const DeleteAccount = asyncHander((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.params;
    const result = yield DeleteAccountService(accountId);
    return res.status(result.status).json({ message: result.message });
}));
