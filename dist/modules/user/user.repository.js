var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { drizzle } from "drizzle-orm/node-postgres";
import { User } from "../../db/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
const db = drizzle(process.env.DATABASE_URL);
export const RegisterRepository = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield db.select().from(User).where(eq(User.phoneNo, data.phoneNo));
    if (isExist.length > 0) {
        return { message: "User Already Exist", status: 409 };
    }
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const response = yield db.insert(User).values({
        name: data.name,
        email: data.email,
        address: data.address,
        phoneNo: data.phoneNo,
        password: hashedPassword
    });
    return { message: "Account Created successfully", status: 201 };
});
export const LoginRespository = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db.select().from(User).where(eq(User.phoneNo, data.phoneNo));
    if (user.length < 1) {
        return { message: "User Doesn't Exist, Please SignUp", status: 404 };
    }
    const foundUser = user[0];
    const isPasswordMatched = yield bcrypt.compare(data.password, foundUser.password);
    if (!isPasswordMatched) {
        return { message: "Invalid credentials", status: 401 };
    }
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        return;
    }
    const token = jwt.sign({ phoneHNo: data.phoneNo }, secret, { expiresIn: '12h' });
    if (!token) {
        return { message: "some error has occured loggin after some time", status: 200 };
    }
    console.log("token of the user:- ", token);
    console.log("this is user's details:- ", user);
    return { message: "Login successful", status: 200, token };
});
export const ProfileRepository = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield db.select().from(User).where(eq(User.id, userId));
    return { message: "profile retured successfully", status: 200, user: userDetails[0] };
});
export const UpdateProfileRespository = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db.select().from(User).where(eq(User.id, userId));
        if (user.length < 1) {
            return { message: "unable to find profile", status: 404 };
        }
        yield db.update(User).set({
            name: data.name,
            email: data.email,
            address: data.address,
            phoneNo: data.phoneNo,
            updated_at: new Date()
        }).where(eq(User.id, userId));
        return { message: "profile updated Successfully", status: 200 };
    }
    catch (error) {
        return { message: "unable to find profile", status: 500 };
    }
});
export const DeleteProfileRepository = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db.select().from(User).where(eq(User.id, userId));
        if (user.length < 1) {
            return { message: "unable to find profile", status: 404 };
        }
        yield db.delete(User).where(eq(User.id, userId));
        return { message: "profile delete successfully", status: 200 };
    }
    catch (error) {
        return { message: "some Invalid error has occured", status: 500 };
    }
});
