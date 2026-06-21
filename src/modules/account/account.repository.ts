import { drizzle } from "drizzle-orm/node-postgres";
import { Account } from "../../db/schema.js";
import { AccountRegisterSchema } from "./account.types.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const CreateAccountRepository = async (data: AccountRegisterSchema) => {
    try {
        if (data.category == null) {
            return { message: "Category is required", status: 400 };
        }

        const isExist = await db.select().from(Account).where(eq(Account.category, data.category));
        if (isExist.length > 0) {
            return { message: "Account Already Exist", status: 302 };
        }
        await db.insert(Account).values({
            category: data.category,
            balance: data.balance,
            user_id: data.user_id
        });

        return { message: "Account Created Successfully", status: 200 };

    } catch (error) {
        console.log("repo file:- ", error)
        return { message: "Unable to create Account", status: 304 };
    }
}

export const GetAccountDetailsRepository = async (accountId: string) => {
    try {
        const accountdetails = await db.select().from(Account).where(eq(Account.id, accountId));
        return { message: "here your Account details", staus: 300, account: accountdetails };
    } catch (error) {
        return { message: "unable to fetched details", status: 300 };
    }
}

export const GetUserAllAccountRepository = async (userId: string) => {
    try {
        const accountdetails = await db.select().from(Account).where(eq(Account.user_id, userId));
        return { message: "here your Account details", staus: 300, account: accountdetails };
    } catch (error) {
        return { message: "unable to fetched details", status: 300 };
    }
}

export const DeleteAccountRepository = async (accountId: string) => {
    try {
        await db.delete(Account).where(eq(Account.id, accountId));
        return { message: "Account deleted successfully", status: 200 };
    } catch (error) {
        return { message: "unable to delete account", status: 304 };
    }
}