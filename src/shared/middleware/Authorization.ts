import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Account } from "../../db/schema.js";
import { GetAccountDetailsRepository } from "../../modules/account/account.repository.js";

const db = drizzle(process.env.DATABASE_URL!);

export const authorizeUserAccess = (paramName = "userId") => {
    return (req: any, res: any, next: any) => {
        const authenticatedUser = req.user;
        const requestedUserId = req.params?.[paramName];

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
    return async (req: any, res: any, next: any) => {
        const authenticatedUser = req.user;
        const accountId = req.params?.[paramName];

        if (!authenticatedUser || !authenticatedUser.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!accountId) {
            return res.status(400).json({ message: "Missing account id" });
        }

        const result = await GetAccountDetailsRepository(accountId);

        if (result.status === 404 || !result.account || result.account.length < 1) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (authenticatedUser.id !== result.account[0].user_id) {
            return res.status(403).json({ message: "Forbidden: user not allowed to access this resource" });
        }

        next();
    };
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
export const authorizeTransactionAccess = (fieldName = "senderAccountNo", lookupBy: "accountNo" | "accountId" = "accountNo") => {
    return async (req: any, res: any, next: any) => {
        const authenticatedUser = req.user;

        if (!authenticatedUser || !authenticatedUser.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Check params first (URL path), then fall back to body
        const fieldValue = req.params?.[fieldName] ?? req.body?.[fieldName];

        if (!fieldValue) {
            return res.status(400).json({ message: `Missing required field: ${fieldName}` });
        }

        try {
            let account;

            if (lookupBy === "accountNo") {
                const results = await db.select().from(Account).where(eq(Account.accountNo, Number(fieldValue)));
                account = results[0];
            } else {
                const results = await db.select().from(Account).where(eq(Account.id, String(fieldValue)));
                account = results[0];
            }

            if (!account) {
                return res.status(404).json({ message: "Source account not found" });
            }

            if (authenticatedUser.id !== account.user_id) {
                return res.status(403).json({ message: "Forbidden: you do not own this account" });
            }

            next();
        } catch (error) {
            return res.status(500).json({ message: "Authorization check failed" });
        }
    };
};