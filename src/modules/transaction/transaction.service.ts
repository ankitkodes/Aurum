
import { CreditMoneyRepository, DepositMoneyRepository, SendMoneyRespository } from "./transaction.repository.js";
import { CreditMoneySchema, DepositMoneyType, SendMoneySchema } from "./transaction.types.js"

export const SendMoneyService = async ({ senderAccountNo, receiverAccountNo, amount }: SendMoneySchema) => {
    return SendMoneyRespository({ senderAccountNo, receiverAccountNo, amount });
}

export const DepositMoneyService = async (data: DepositMoneyType) => {
    if (Number(data.transaction_amount) < 500) {
        return { message: "Minimum deposit amount should be greater than or equal to 500", status: 400 };
    }
    return await DepositMoneyRepository(data);
}

export const CreditMoneyService = async ({ accountNo, amount }: CreditMoneySchema) => {
    try {
        if (Number(amount) < 500) {
            return { message: "Minimum withdrawal amount should be greater than or equal to 500", status: 400 };

        }
        return await CreditMoneyRepository({ accountNo, amount });
    } catch (error) {
        return { message: "Failed to process withdrawal, please try again later", status: 500 };
    }
}