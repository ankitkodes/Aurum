var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Account, Audit_log, LedgerSystem, Transaction } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { InsufficientBalanceError } from "../../errors/account/InsufficientBalanceError.js";
import { AccountNotFoundError } from "../../errors/account/AccountNotFoundError.js";
export const SendMoneyRespository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderAccountNo, receiverAccountNo, amount }) {
    try {
        // validating sender Account
        const IssenderidExist = yield db.select().from(Account).where(eq(Account.accountNo, Number(senderAccountNo)));
        if (IssenderidExist.length < 1) {
            throw new AccountNotFoundError(String(senderAccountNo));
        }
        // checking amount where transtaction amount should be less than sender balance
        if (Number(IssenderidExist[0].balance) < Number(amount)) {
            throw new InsufficientBalanceError();
        }
        // validing receiver account
        const IsreceiverId = yield db.select().from(Account).where(eq(Account.accountNo, Number(receiverAccountNo)));
        if (IsreceiverId.length < 1) {
            throw new AccountNotFoundError(String(receiverAccountNo));
        }
        // platform account Id
        const platform_account_id = process.env.PLATFORM_ACCOUNTNO;
        if (!platform_account_id) {
            return { message: "missing platform account details", status: 403 };
        }
        // transaction where the money is tranfer from sender account to receiver account and also being deducted platfrom charges
        yield db.transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
            const platform_charges = Number(amount) * 3 / 100;
            const totalamount = Number(amount) - platform_charges;
            // creating a transaction and transfering money from sender Account to receiver Account
            const [transferMoney] = yield tsx.insert(Transaction)
                .values({
                transaction_amount: String(totalamount),
                sender_account_id: IssenderidExist[0].id,
                receiver_account_id: IsreceiverId[0].id,
                transactionType: "Credit",
                status: "Success",
                account_id: IssenderidExist[0].id,
            })
                .returning({ id: Transaction.id });
            //   recording in audit_log 
            yield tsx.insert(Audit_log).values({
                user_id: IssenderidExist[0].user_id,
                entity_id: transferMoney.id,
                action: "Money transferred",
                entity_type: "Transaction",
                metadata: {
                    transactionId: transferMoney.id,
                    senderAccountId: IssenderidExist[0].id,
                    receiverAccountId: IsreceiverId[0].id,
                    amount,
                    netAmount: String(totalamount),
                    platformCharges: String(platform_charges)
                }
            });
            // entry in ledgersystem  for sender details
            yield tsx.insert(LedgerSystem).values({
                account_id: IssenderidExist[0].id,
                transaction_id: transferMoney.id,
                type: "Debit",
                amount: amount
            });
            // entry in ledgersystem for receiver details
            yield tsx.insert(LedgerSystem).values({
                account_id: IsreceiverId[0].id,
                transaction_id: transferMoney.id,
                type: "Credit",
                amount: String(totalamount)
            });
            //  entry in ledgersystem for platform charges
            yield tsx.insert(LedgerSystem).values({
                account_id: platform_account_id,
                transaction_id: transferMoney.id,
                type: "Credit",
                amount: String(platform_charges)
            });
            // updating receiver account balance 
            yield tsx.update(Account).set({
                balance: String(Number(IsreceiverId[0].balance) + totalamount)
            }).where(eq(Account.id, IsreceiverId[0].id));
            // updating sender account balance (deduct the full amount, not just totalamount)
            yield tsx.update(Account).set({
                balance: String(Number(IssenderidExist[0].balance) - Number(amount))
            }).where(eq(Account.id, IssenderidExist[0].id));
        }));
        return { message: "Money transferred successfully", status: 200 };
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
export const DepositMoneyRepository = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAccount = yield db.select().from(Account).where(eq(Account.id, data.sender_account_id));
        if (isAccount.length < 1) {
            throw new AccountNotFoundError(data.sender_account_id);
        }
        const totalamount = Number(data.transaction_amount) + Number(isAccount[0].balance);
        const transaction = yield db.transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
            //  creating transaction for adding money to account 
            const [depositTransaction] = yield tsx.insert(Transaction).values({
                transaction_amount: data.transaction_amount,
                receiver_account_id: data.sender_account_id,
                transactionType: "Credit",
                status: "Success",
                account_id: data.sender_account_id,
                sender_account_id: data.sender_account_id
            }).returning({ id: Transaction.id });
            // recording in audit_log
            yield tsx.insert(Audit_log).values({
                user_id: isAccount[0].user_id,
                entity_id: depositTransaction.id,
                action: "Deposit completed",
                entity_type: "Transaction",
                metadata: {
                    transactionId: depositTransaction.id,
                    accountId: data.sender_account_id,
                    amount: data.transaction_amount,
                    newBalance: String(totalamount)
                }
            });
            // ledger entry for deposit
            yield tsx.insert(LedgerSystem).values({
                account_id: data.sender_account_id,
                transaction_id: depositTransaction.id,
                type: "Credit",
                amount: data.transaction_amount
            });
            // updating account balance 
            yield tsx.update(Account).set({
                balance: String(totalamount)
            }).where(eq(Account.id, data.sender_account_id));
        }));
        return { message: "Deposit completed successfully", status: 200, transaction };
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
export const CreditMoneyRepository = (_a) => __awaiter(void 0, [_a], void 0, function* ({ accountNo, amount }) {
    try {
        const isAccount = yield db.select().from(Account).where(eq(Account.accountNo, accountNo));
        if (isAccount.length < 1) {
            throw new AccountNotFoundError(String(accountNo));
        }
        if (Number(isAccount[0].balance) < Number(amount)) {
            throw new InsufficientBalanceError();
        }
        //   credit money from account;
        yield db.transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
            // credit  money from account
            const [withdrawTransaction] = yield tsx.insert(Transaction).values({
                transaction_amount: amount,
                sender_account_id: isAccount[0].id,
                receiver_account_id: isAccount[0].id,
                transactionType: "Debit",
                status: "Success",
                account_id: isAccount[0].id
            }).returning({ id: Transaction.id });
            // recording in audit_log 
            yield tsx.insert(Audit_log).values({
                user_id: isAccount[0].user_id,
                entity_id: withdrawTransaction.id,
                action: "Withdrawal completed",
                entity_type: "Transaction",
                metadata: {
                    transactionId: withdrawTransaction.id,
                    accountId: isAccount[0].id,
                    amount,
                    remainingBalance: String(Number(isAccount[0].balance) - Number(amount))
                }
            });
            // ledger entry for withdrawal
            yield tsx.insert(LedgerSystem).values({
                account_id: isAccount[0].id,
                transaction_id: withdrawTransaction.id,
                type: "Debit",
                amount
            });
            // updating account balance
            yield tsx.update(Account).set({
                balance: String(Number(isAccount[0].balance) - Number(amount))
            }).where(eq(Account.id, isAccount[0].id));
        }));
        return { message: "Withdrawal completed successfully", status: 200 };
    }
    catch (err) {
        console.error(err);
        throw err;
    }
});
