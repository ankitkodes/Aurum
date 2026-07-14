import { CheckElegiblityCriteria } from "../../shared/utils/Account.js";
import { CreateAccountRepository, DeleteAccountRepository, GetAccountDetailsRepository, GetTransactionHistoryRepository, GetUserAllAccountRepository } from "./account.repository.js";
import { AccountRegisterSchema } from "./account.types.js";

export const CreateAccountService = async (data: AccountRegisterSchema, userId: string) => {
    // Throws ValidationError if criteria not met
    CheckElegiblityCriteria(data);
    return await CreateAccountRepository(data, userId);
}

export const GetAccountDetailsService = async (accountId: string) => {
    return await GetAccountDetailsRepository(accountId);
}

export const TransactionHistoryService = async (accountId: string) => {
    return await GetTransactionHistoryRepository(accountId);
}

export const GetUserAllAccountService = async (userId: string) => {
    return GetUserAllAccountRepository(userId);
}

export const DeleteAccountService = async (accountId: string) => {
    return DeleteAccountRepository(accountId);
}