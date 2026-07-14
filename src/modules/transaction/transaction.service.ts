
import { CreditMoneyRepository, DepositMoneyRepository, SendMoneyRespository } from "./transaction.repository.js";
import { CreditMoneySchema, DepositMoneyType, SendMoneySchema } from "./transaction.types.js"
import { ValidationError } from "../../errors/validation/ValidationError.js";

export const SendMoneyService = async ({ senderAccountNo, receiverAccountNo, amount }: SendMoneySchema) => {
    return SendMoneyRespository({ senderAccountNo, receiverAccountNo, amount });
}

export const DepositMoneyService = async (data: DepositMoneyType) => {
    if (Number(data.transaction_amount) < 500) {
        throw new ValidationError("Minimum deposit amount should be greater than or equal to 500");
    }
    return await DepositMoneyRepository(data);
}

export const CreditMoneyService = async ({ accountNo, amount }: CreditMoneySchema) => {
    if (Number(amount) < 500) {
        throw new ValidationError("Minimum withdrawal amount should be greater than or equal to 500");
    }
    return await CreditMoneyRepository({ accountNo, amount });
}