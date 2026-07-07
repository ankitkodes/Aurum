import { Router } from "express";
import { CreditMoney, DepositMoney, SendMoney } from "./transaction.controller.js";
import { authenticate } from "../../shared/middleware/Authentication.js";
const router = Router();
router.use(authenticate);
router.post("/send", SendMoney);
router.post("/deposit", DepositMoney);
router.post("/credit", CreditMoney);
export const transactionRoutes = router;
