var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CreditMoneyService, DepositMoneyService, SendMoneyService } from "./transaction.service.js";
import { DepositMoneySchema } from "./transaction.types.js";
export const SendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderAccountNo } = req.params;
        const { receiverAccountNo } = req.params;
        const { amount } = req.body;
        const result = yield SendMoneyService({ senderAccountNo: Number(senderAccountNo), receiverAccountNo: Number(receiverAccountNo), amount });
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to transfer money" });
    }
});
export const DepositMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const transactionDetails = yield DepositMoneySchema.parse(data);
        const result = yield DepositMoneyService(transactionDetails);
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(500).json({ message: "unable to deposit money" });
    }
});
export const CreditMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountNo } = req.params;
        const amount = req.body;
        const result = yield CreditMoneyService({ accountNo, amount });
        return res.status(result.status).json({ message: result.message });
    }
    catch (error) {
        return res.status(500).json({ message: "unable to credit money " });
    }
});
