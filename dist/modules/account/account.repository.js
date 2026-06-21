var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { drizzle } from "drizzle-orm/node-postgres";
import { Account } from "../../db/schema.js";
import { eq } from "drizzle-orm";
const db = drizzle(process.env.DATABASE_URL);
export const CreateAccountRepository = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.category == null) {
            return { message: "Category is required", status: 400 };
        }
        const isExist = yield db.select().from(Account).where(eq(Account.category, data.category));
        if (isExist.length > 0) {
            return { message: "Account Already Exist", status: 302 };
        }
        yield db.insert(Account).values({
            category: data.category,
            balance: data.balance,
            user_id: data.user_id
        });
        return { message: "Account Created Successfully", status: 200 };
    }
    catch (error) {
        console.log("repo file:- ", error);
        return { message: "Unable to create Account", status: 304 };
    }
});
export const GetAccountDetailsRepository = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountdetails = yield db.select().from(Account).where(eq(Account.id, accountId));
        return { message: "here your Account details", staus: 300, account: accountdetails };
    }
    catch (error) {
        return { message: "unable to fetched details", status: 300 };
    }
});
export const GetUserAllAccountRepository = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountdetails = yield db.select().from(Account).where(eq(Account.user_id, userId));
        return { message: "here your Account details", staus: 300, account: accountdetails };
    }
    catch (error) {
        return { message: "unable to fetched details", status: 300 };
    }
});
export const DeleteAccountRepository = (accountId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db.delete(Account).where(eq(Account.id, accountId));
        return { message: "Account deleted successfully", status: 200 };
    }
    catch (error) {
        return { message: "unable to delete account", status: 304 };
    }
});
