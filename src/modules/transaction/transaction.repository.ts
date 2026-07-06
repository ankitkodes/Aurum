import { drizzle } from "drizzle-orm/node-postgres";
import { CreditMoneySchema, DepositMoneyType, SendMoneySchema } from "./transaction.types.js"
import { Account, LedgerSystem, Transaction, TransactionTypeEnum } from "../../db/schema.js";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const SendMoneyRespository = async ({ senderAccountNo, receiverAccountNo, amount }: SendMoneySchema) => {
    const IssenderidExist = await db.select().from(Account).where(eq(Account.accountNo, Number(senderAccountNo)));
    if (IssenderidExist.length < 1) {
        return { message: "Sender account not found", status: 404 };
    }
    if (Number(IssenderidExist[0].balance > amount)) {
        return { message: "Insufficient balance in sender account", status: 400 };
    }
    const IsreceiverId = await db.select().from(Account).where(eq(Account.accountNo, Number(receiverAccountNo)));
    if (IsreceiverId.length < 1) {
        return { message: "Receiver account not found", status: 404 }
    }

    await db.transaction(async (tsx) => {
        const platform_charges = Number(amount) * 3 / 100;
        const totalamount = Number(amount) - platform_charges;

        // creating a transaction and transfering money from sender Account to receiver Account
        const [transferMoney] = await tsx.insert(Transaction)
            .values({
                transaction_amount: String(totalamount),
                sender_account_id: IssenderidExist[0].id,
                receiver_account_id: IsreceiverId[0].id,
                transactionType: "Credit",
                status: "Success",
                account_id: IssenderidExist[0].id,
            })
            .returning({ id: Transaction.id });

        // entry in ledgersystem  for sender details
        await tsx.insert(LedgerSystem).values({
            account_id: IssenderidExist[0].id,
            transaction_id: transferMoney.id,
            type: "Debit",
            amount: amount
        });


        // entry in ledgersystem for receiver details
        await tsx.insert(LedgerSystem).values({
            account_id: IsreceiverId[0].id,
            transaction_id: transferMoney.id,
            amount: String(totalamount)
        })

        //  entry in ledgersystem for platform charges
        await tsx.insert(LedgerSystem).values({
            account_id: process.env.PLATFORM_CHARGE!,
            transaction_id: transferMoney.id,
            type: "Credit",
            amount: String(platform_charges)
        });

        // updating receiver account balance 
        await tsx.update(Account).set({
            balance: String(Number(IsreceiverId[0].balance) + totalamount)
        }).where(eq(Account.id, IsreceiverId[0].id))

        // updating sender account balance
        await tsx.update(Account).set({
            balance: String(Number(IssenderidExist[0].balance) - totalamount)
        }).where(eq(Account.id, IssenderidExist[0].id,))
    })

    return { message: "Money transferred successfully", status: 200 };
}

export const DepositMoneyRepository = async (data: DepositMoneyType) => {
    try {
        const isAccount = await db.select().from(Account).where(eq(Account.id, data.sender_account_id));
        if (isAccount.length < 1) {
            return { message: "Account not found for deposit", status: 404 };
        }
        const totalamount = Number(data.transaction_amount) + Number(isAccount[0].balance);
        const transaction = await db.transaction(async (tsx) => {

            //  creating transaction for adding money to account 
            await tsx.insert(Transaction).values({
                transaction_amount: data.transaction_amount,
                receiver_account_id: data.sender_account_id,
                transactionType: "Debit",
                status: "Success",
                account_id: data.sender_account_id,
                sender_account_id: data.sender_account_id
            });

            // updating account balance 
            await tsx.update(Account).set({
                balance: String(totalamount)
            }).where(eq(Account.id, data.sender_account_id));
        })
        return { message: "Deposit completed successfully", status: 200, transaction };
    } catch (error) {
        return { message: "Failed to deposit money, please try again later", status: 500 };
    }

}

export const CreditMoneyRepository = async ({ accountNo, amount }: CreditMoneySchema) => {
    try {
        const isAccount = await db.select().from(Account).where(eq(Account.accountNo, accountNo));
        if (isAccount.length < 1) {
            return { message: "Account not found for withdrawal", status: 404 };
        }
        if (Number(isAccount[0].balance) < Number(amount)) {
            return { message: "Insufficient balance for withdrawal", status: 400 };
        }

        //   credit money from account;

        await db.transaction(async (tsx) => {
            // credit  money from account
            await tsx.insert(Transaction).values({
                transaction_amount: amount,
                sender_account_id: isAccount[0].id,
                receiver_account_id: isAccount[0].id,
                transactionType: "Credit",
                status: "Success",
                account_id: isAccount[0].id
            });

            // updating account balance
            await tsx.update(Account).set({
                balance: String(Number(isAccount[0].balance) - Number(amount))
            }).where(eq(Account.id, isAccount[0].id))
        })
        return { message: "Withdrawal completed successfully", status: 200 };
    } catch (error) {
        return { message: "Failed to withdraw money, please try again later", status: 500 };
    }
}