import { Router } from "express";
import { CreateAccount, DeleteAccount, GetAccountDetails, GetUserAllAccount } from "./account.controller.js";

const router = Router();

router.post("/create", CreateAccount);
// router.put("/deposit/:accountId", DepositMoney);
router.get("/accoutDetails/:accountId", GetAccountDetails);
router.get("/account/:userId", GetUserAllAccount);
router.delete("/deleteAccount/:accountId", DeleteAccount);


export const AccountRoutes = router;