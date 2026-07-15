var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreditMoneyRepository, DepositMoneyRepository, SendMoneyRespository } from "./transaction.repository.js";
import { ValidationError } from "../../errors/validation/ValidationError.js";
export const SendMoneyService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderAccountNo, receiverAccountNo, amount }) {
    return SendMoneyRespository({ senderAccountNo, receiverAccountNo, amount });
});
export const DepositMoneyService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (Number(data.transaction_amount) < 500) {
        throw new ValidationError("Minimum deposit amount should be greater than or equal to 500");
    }
    return yield DepositMoneyRepository(data);
});
export const CreditMoneyService = (_a) => __awaiter(void 0, [_a], void 0, function* ({ accountNo, amount }) {
    if (Number(amount) < 500) {
        throw new ValidationError("Minimum withdrawal amount should be greater than or equal to 500");
    }
    return yield CreditMoneyRepository({ accountNo, amount });
});
