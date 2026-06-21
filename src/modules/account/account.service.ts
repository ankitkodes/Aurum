import { CheckElegiblityCriteria } from "../../shared/utils/Account.js";
import { CreateAccountRepository, DeleteAccountRepository, GetAccountDetailsRepository, GetUserAllAccountRepository } from "./account.repository.js";
import { AccountRegisterSchema } from "./account.types.js";

export const CreateAccountService = async (data: AccountRegisterSchema) => {
    const isEligble = CheckElegiblityCriteria(data);
    if (isEligble) {
        return isEligble;
    }
    console.log("till here it ran successfully")
    return await CreateAccountRepository(data);
}

export const GetAccountDetailsService = async (accountId: string) => {
    return await GetAccountDetailsRepository(accountId);
}

export const GetUserAllAccountService = async (userId: string) => {
    return GetUserAllAccountRepository(userId);
}

export const DeleteAccountService = async (accountId: string) => {
    return DeleteAccountRepository(accountId);
}