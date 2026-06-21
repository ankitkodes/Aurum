var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CheckElegiblityCriteria } from "../../shared/utils/Account.js";
import { CreateAccountRepository, DeleteAccountRepository, GetAccountDetailsRepository, GetUserAllAccountRepository } from "./account.repository.js";
export const CreateAccountService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isEligble = CheckElegiblityCriteria(data);
    if (isEligble) {
        return isEligble;
    }
    console.log("till here it ran successfully");
    return yield CreateAccountRepository(data);
});
export const GetAccountDetailsService = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield GetAccountDetailsRepository(accountId);
});
export const GetUserAllAccountService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return GetUserAllAccountRepository(userId);
});
export const DeleteAccountService = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    return DeleteAccountRepository(accountId);
});
