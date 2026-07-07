import { StringifyOptions } from "node:querystring";
import { CreateAccountService, DeleteAccountService, GetAccountDetailsService, GetUserAllAccountService } from "./account.service.js";
import { AccountRegister, AccountRegisterSchema } from "./account.types.js"

export const CreateAccount = async (req: { body: AccountRegisterSchema; params: { userId: string } }, res: any) => {
    try {
        const { userId } = req.params;
        const data = await AccountRegister.parse(req.body);
        const result = await CreateAccountService(data, userId);
        if (!result) {
            return res.status(500).json({ message: "Some problem occured, try again later" })
        }
        return res.status(result.status).json({ message: result.message })
    } catch (error) {
        console.log("controller values:- ", error)
        return res.status(500).json({ message: "Unable to create Account" })
    }
};


export const GetAccountDetails = async (req: { params: { accountId: string } }, res: any) => {
    try {
        const { accountId } = req.params;
        const result = await GetAccountDetailsService(accountId);
        return res.status(result.status).json({ message: result.message, account: result.account });

    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch details, try again later" })
    }
}

export const GetUserAllAccount = async (req: { params: { userId: string } }, res: any) => {
    try {
        const { userId } = req.params;
        const result = await GetUserAllAccountService(userId);
        return res.status(result.status).json({ message: result.message, account: result.account });

    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch user accounts" });
    }
}

export const DeleteAccount = async (req: { params: { accountId: string } }, res: any) => {
    try {
        const { accountId } = req.params;
        const result = await DeleteAccountService(accountId);
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        return res.status(500).json({ message: "Unable to delete account" })
    }
}