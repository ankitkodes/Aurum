import { NextFunction } from "express";

// global controller error handler
export const asyncHander = (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next).catch(next));