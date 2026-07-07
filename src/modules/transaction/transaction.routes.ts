import { Router } from "express";
import { CreditMoney, DepositMoney, SendMoney } from "./transaction.controller.js";
import { authenticate } from "../../shared/middleware/Authentication.js";
import { authorizeTransactionAccess } from "../../shared/middleware/Authorization.js";

const router = Router();

router.use(authenticate);
router.post("/send/:senderAccountNo/:receiverAccountNo", authorizeTransactionAccess("senderAccountNo", "accountNo"), SendMoney);
router.post("/deposit", authorizeTransactionAccess("sender_account_id", "accountId"), DepositMoney);
router.post("/credit/:accountNo", authorizeTransactionAccess("accountNo", "accountNo"), CreditMoney);

export const transactionRoutes = router;