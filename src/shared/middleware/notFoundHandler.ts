import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/base/AppError.js";


export const notFoundHandler = async (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
}