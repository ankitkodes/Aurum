import { drizzle } from "drizzle-orm/node-postgres";
import { Account, Audit_log, Transaction } from "../../db/schema.js";
import { AccountRegisterSchema } from "./account.types.js";
import { desc, eq, or } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const CreateAccountRepository = async (data: AccountRegisterSchema, userId: string) => {
    try {
        if (data.category == null) {
            return { message: "Category is required", status: 400 };
        }

        const isExist = await db.select().from(Account).where(eq(Account.category, data.category));
        if (isExist.length > 0) {
            return { message: "Account Already Exist", status: 302 };
        }

        const [createdAccount] = await db.insert(Account).values({
            category: data.category,
            balance: data.balance,
            user_id: userId
        }).returning({ id: Account.id });

        await db.insert(Audit_log).values({
            user_id: userId,
            entity_id: createdAccount.id,
            action: "Account created",
            entity_type: "Account",
            metadata: {
                category: data.category,
                balance: data.balance,
                userId
            }
        });

        return { message: "Account Created Successfully", status: 200 };
    } catch (error) {
        console.log("repo file:- ", error);
        return { message: "Unable to create Account", status: 304 };
    }
};

export const GetAccountDetailsRepository = async (accountId: string) => {
    try {
        const accountdetails = await db.select().from(Account).where(eq(Account.id, accountId));
        if (accountdetails.length < 1) {
            return { message: "There isn't account Create it", status: 203 };
        }
        return { message: "here your Account details", status: 300, account: accountdetails };
    } catch (error) {
        return { message: "unable to fetched details", status: 300 };
    }
};

export const GetTransactionHistoryRepository = async (accountId: string) => {
    try {
        const transactions = await db.select()
            .from(Transaction)
            .where(or(
                eq(Transaction.sender_account_id, accountId),
                eq(Transaction.receiver_account_id, accountId)
            ))
            .orderBy(desc(Transaction.created_at));

        if (transactions.length < 1) {
            return { message: "No transaction history found", status: 404, transactions: [] };
        }

        return { message: "Transaction history fetched successfully", status: 200, transactions };
    } catch (error) {
        return { message: "Unable to fetch transaction history", status: 500, transactions: [] };
    }
};

export const GetUserAllAccountRepository = async (userId: string) => {
    try {
        const accountdetails = await db.select().from(Account).where(eq(Account.user_id, userId));
        return { message: "here your Account details", staus: 300, account: accountdetails };
    } catch (error) {
        return { message: "unable to fetched details", status: 300 };
    }
};

export const DeleteAccountRepository = async (accountId: string) => {
    try {
        const account = await db.select().from(Account).where(eq(Account.id, accountId));
        if (account.length < 1) {
            return { message: "Account not found", status: 404 };
        }

        await db.insert(Audit_log).values({
            user_id: account[0].user_id,
            entity_id: account[0].id,
            action: "Account deleted",
            entity_type: "Account",
            metadata: {
                deletedAccount: {
                    id: account[0].id,
                    category: account[0].category,
                    balance: account[0].balance,
                    userId: account[0].user_id,
                }
            }
        });

        await db.delete(Account).where(eq(Account.id, accountId));
        return { message: "Account deleted successfully", status: 200 };
    } catch (error) {
        return { message: "unable to delete account", status: 304 };
    }
};
