import 'dotenv/config';
import express from "express";
import { UserRoutes } from "./modules/user/user.routes.js";
import { AccountRoutes } from './modules/account/account.routes.js';
import { transactionRoutes } from './modules/transaction/transaction.routes.js';
import { swaggerRouter } from './config/swagger.js';
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerRouter);
app.use("/api/user", UserRoutes);
app.use("/api/account", AccountRoutes);
app.use("/api/transaction", transactionRoutes);
app.listen(port, () => {
    console.log(`running port on ${port}`);
});
