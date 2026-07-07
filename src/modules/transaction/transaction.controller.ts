import { CreditMoneyService, DepositMoneyService, SendMoneyService } from "./transaction.service.js";
import { DepositMoneySchema } from "./transaction.types.js";


export const SendMoney = async (req: { body: { amount: string }; params: { senderAccountNo: string, receiverAccountNo: string } }, res: any) => {
    try {
        const { senderAccountNo } = req.params;
        const { receiverAccountNo } = req.params;
        const { amount } = req.body;
        const result = await SendMoneyService({ senderAccountNo: Number(senderAccountNo), receiverAccountNo: Number(receiverAccountNo), amount });
        return res.status(result.status).json({ message: result.message });
    } catch (error) {
        console.log("error from sendmoney controller:- ", error);
        return res.status(500).json({ message: "unable to tranfer money" })
    }
}
export const DepositMoney = async (req: { body: string; }, res: any) => {
    try {
        const data = req.body;
        const transactionDetails = await DepositMoneySchema.parse(data);
        const result = await DepositMoneyService(transactionDetails);
    } catch (error) {
        return res.status(500).json({ message: "unable to deposit money" })
    }
}


export const CreditMoney = async (req: { params: { accountNo: number, amount: string } }, res: any) => {
    try {
        const { accountNo } = req.params;
        const { amount } = req.params;
        const result = await CreditMoneyService({ accountNo, amount });
        return res.status(result.status).json({ message: result.message })
    } catch (error) {
        return res.status(500).json({ message: "unable to credit money "})
    }
}
