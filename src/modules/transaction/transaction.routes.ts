import { Router } from "express";
import { DepositMoney } from "./transaction.controller.js";
import { authenticate } from "../../shared/middleware/Authentication.js";

const router = Router();

router.use(authenticate);
router.post("/send");
router.post("/deposit", DepositMoney);
router.post("/borrow")



export const transactionRoutes = router;