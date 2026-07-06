import { CreditMoneyService, DepositMoneyService, SendMoneyService } from "./transaction.service.js";
import { DepositMoneySchema } from "./transaction.types.js";


export const SendMoney = async (req: { body: string; params: { senderAccountNo: number, receiverAccountNo: number } }, res: any) => {
    try {
        const { senderAccountNo } = req.params;
        const { receiverAccountNo } = req.params;
        const amount = req.body;
        const result = await SendMoneyService({ senderAccountNo, receiverAccountNo, amount });
        return res.status(result?.status || 200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Unable to transfer money, please try again later", status: 500 })
    }
}
export const DepositMoney = async (req: { body: string; }, res: any) => {
    try {
        const data = req.body;
        const transactionDetails = await DepositMoneySchema.parse(data);
        const result = await DepositMoneyService(transactionDetails);
        return res.status(result?.status || 200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Unable to deposit money, please try again later", status: 500 })
    }
}


export const CreditMoney = async (req: { params: { accountNo: number, amount: string } }, res: any) => {
    try {
        const { accountNo } = req.params;
        const { amount } = req.params;
        const result = await CreditMoneyService({ accountNo, amount });
        return res.status(result?.status || 200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Unable to withdraw money, please try again later", status: 500 })
    }
}
