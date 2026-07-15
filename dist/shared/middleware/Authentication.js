import jwt from "jsonwebtoken";
import { InvalidTokenError } from "../../errors/auth/InvalidTokenError.js";
import { UnauthorizedError } from "../../errors/auth/UnauthorizedError.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError();
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        return res.status(500).json({ message: "authentication secret not configured" });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            throw new InvalidTokenError();
        }
        req.user = user;
        next();
    });
};
