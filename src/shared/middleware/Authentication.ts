import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "token not found" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
        return res.status(500).json({ message: "authentication secret not configured" });
    }

    jwt.verify(token, secret, (err: any, user: any) => {
        if (err) {
            return res.status(401).json({ message: "invalid token" });
        }

        req.user = user;
        next();
    });
};