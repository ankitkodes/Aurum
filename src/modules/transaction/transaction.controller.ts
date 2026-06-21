

export const DepositMoney = async (req: { body: string; params: { accountId: string } }, res: any) => {
    try {
        // const { accountId } = req.body;
        // const result = await DepositMoney(accountId);
    } catch (error) {
        return res.status(302).json({ message: "unable to deposit money" })
    }
}