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
import { eq } from "drizzle-orm";
import { Account } from "../../db/schema.js";
import { GetAccountDetailsRepository } from "../../modules/account/account.repository.js";
const db = drizzle(process.env.DATABASE_URL);
export const authorizeUserAccess = (paramName = "userId") => {
    return (req, res, next) => {
        var _a;
        const authenticatedUser = req.user;
        const requestedUserId = (_a = req.params) === null || _a === void 0 ? void 0 : _a[paramName];
        if (!authenticatedUser || !authenticatedUser.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!requestedUserId) {
            return res.status(400).json({ message: "Missing resource owner id" });
        }
        if (authenticatedUser.id !== requestedUserId) {
            return res.status(403).json({ message: "Forbidden: user not allowed to access this resource" });
        }
        next();
    };
};
export const authorizeAccountAccess = (paramName = "accountId") => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const authenticatedUser = req.user;
        const accountId = (_a = req.params) === null || _a === void 0 ? void 0 : _a[paramName];
        if (!authenticatedUser || !authenticatedUser.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!accountId) {
            return res.status(400).json({ message: "Missing account id" });
        }
        const result = yield GetAccountDetailsRepository(accountId);
        if (result.status === 404 || !result.account || result.account.length < 1) {
            return res.status(404).json({ message: "Account not found" });
        }
        if (authenticatedUser.id !== result.account[0].user_id) {
            return res.status(403).json({ message: "Forbidden: user not allowed to access this resource" });
        }
        next();
    });
};
/**
 * Middleware to authorize transaction access.
 * Verifies that the authenticated user owns the sender/source account
 * before allowing the transaction to proceed.
 *
 * Supports 3 modes based on how the account is identified:
 *  - "accountNo"  → looks up by Account.accountNo (for send/credit routes)
 *  - "accountId"  → looks up by Account.id UUID  (for deposit route)
 *
 * The field value is resolved from req.params first, then req.body.
 */
export const authorizeTransactionAccess = (fieldName = "senderAccountNo", lookupBy = "accountNo") => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const authenticatedUser = req.user;
        if (!authenticatedUser || !authenticatedUser.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Check params first (URL path), then fall back to body
        const fieldValue = (_b = (_a = req.params) === null || _a === void 0 ? void 0 : _a[fieldName]) !== null && _b !== void 0 ? _b : (_c = req.body) === null || _c === void 0 ? void 0 : _c[fieldName];
        if (!fieldValue) {
            return res.status(400).json({ message: `Missing required field: ${fieldName}` });
        }
        try {
            let account;
            if (lookupBy === "accountNo") {
                const results = yield db.select().from(Account).where(eq(Account.accountNo, Number(fieldValue)));
                account = results[0];
            }
            else {
                const results = yield db.select().from(Account).where(eq(Account.id, String(fieldValue)));
                account = results[0];
            }
            if (!account) {
                return res.status(404).json({ message: "Source account not found" });
            }
            if (authenticatedUser.id !== account.user_id) {
                return res.status(403).json({ message: "Forbidden: you do not own this account" });
            }
            next();
        }
        catch (error) {
            return res.status(500).json({ message: "Authorization check failed" });
        }
    });
};
