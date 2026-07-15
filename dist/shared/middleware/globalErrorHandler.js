var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppError } from "../../errors/base/AppError.js";
export const globalErrorHanlder = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (err instanceof AppError) {
        return res.status(err.StatusCode).json({ success: false, message: err.message });
    }
    console.error(err);
    return res.status(500).json({ success: false, message: "An internal server error has occurred" });
});
