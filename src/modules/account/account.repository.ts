import { drizzle } from "drizzle-orm/node-postgres";
import { Account } from "../../db/schema.js";
import { AccountRegisterSchema } from "./account.types.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const CreateAccountRepository = async (data: AccountRegisterSchema, userId: string) => {
    try {
        if (data.category == null) {
            return { message: "Category is required", status: 400 };
        }

        const isExist = await db.select().from(Account).where(eq(Account.category, data.category));
        if (isExist.length > 0) {
            return { message: "Account Already Exist", status: 409 };
        }
        await db.insert(Account).values({
            category: data.category,
            balance: data.balance,
            user_id: userId
        });

        return { message: "Account Created Successfully", status: 201 };

    } catch (error) {
        console.log("repo file:- ", error)
        return { message: "Unable to create Account", status: 500 };
    }
}

export const GetAccountDetailsRepository = async (accountId: string) => {
    try {
        const accountdetails = await db.select().from(Account).where(eq(Account.id, accountId));
        if (accountdetails.length < 1) {
            return { message: "Account not found", status: 404 };
        }
        return { message: "Account details fetched successfully", status: 200, account: accountdetails };
    } catch (error) {
        return { message: "Unable to fetch account details", status: 500 };
    }
}

export const GetUserAllAccountRepository = async (userId: string) => {
    try {
        const accountdetails = await db.select().from(Account).where(eq(Account.user_id, userId));
        return { message: "User accounts fetched successfully", status: 200, account: accountdetails };
    } catch (error) {
        return { message: "Unable to fetch user accounts", status: 500 };
    }
}

export const DeleteAccountRepository = async (accountId: string) => {
    try {
        await db.delete(Account).where(eq(Account.id, accountId));
        return { message: "Account deleted successfully", status: 200 };
    } catch (error) {
        return { message: "Unable to delete account", status: 500 };
    }
}