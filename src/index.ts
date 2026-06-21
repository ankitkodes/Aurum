import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import express from "express";
import { UserRoutes } from "./modules/user/user.routes.js";
import { AccountRoutes } from './modules/account/account.routes.js';

const port = process.env.PORT
const app = express();
app.use(express.json());


app.use("/api/user", UserRoutes);
app.use("/api/account", AccountRoutes)

app.listen(port, () => {
    console.log(`running port on ${port}`)
})


