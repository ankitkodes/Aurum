import { AppError } from "../base/AppError.js";

export class InsufficientBalanceError extends AppError {
    constructor() {
        super("insufficient balance", 302)
    }
} 