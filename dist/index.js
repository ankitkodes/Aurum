import 'dotenv/config';
import express from "express";
import { UserRoutes } from "./modules/user/user.routes.js";
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api/user", UserRoutes);
app.listen(port, () => {
    console.log(`running port on ${port}`);
});
