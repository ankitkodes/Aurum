import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/base/AppError.js";

export const globalErrorHanlder = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.StatusCode).json({ success: false, message: err.message })
    }

    console.error(err);
    return res.status(500).json({ success: false, message: "An internal server error has occurred" })
}