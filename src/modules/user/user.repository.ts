import { drizzle } from "drizzle-orm/node-postgres";
import { UserLoginSchema, UserRegistrationSchema } from "./user.types.js"
import { User } from "../../db/schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const RegisterRepository = async (data: UserRegistrationSchema) => {
    const isExist = await db.select().from(User).where(eq(User.phoneNo, data.phoneNo));
    if (isExist.length > 0) {
        return { message: "User Already Exist", status: 409 };
    }
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const response = await db.insert(User).values({
        name: data.name,
        email: data.email,
        address: data.address,
        phoneNo: data.phoneNo,
        password: hashedPassword
    });

    return { message: "Account Created successfully", status: 201 }
}


export const LoginRespository = async (data: UserLoginSchema) => {
    const user = await db.select().from(User).where(eq(User.phoneNo, data.phoneNo));
    if (user.length < 1) {
        return { message: "User Doesn't Exist, Please SignUp", status: 404 };
    }
    const foundUser = user[0];
    const isPasswordMatched = await bcrypt.compare(data.password, foundUser.password);
    if (!isPasswordMatched) {
        return { message: "Invalid credentials", status: 401 };
    }
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        return;
    }

    const token: string = jwt.sign({ phoneHNo: data.phoneNo }, secret, { expiresIn: '12h' });
    if (!token) {
        return { message: "some error has occured loggin after some time", status: 200 };
    }
    console.log("token of the user:- ", token);
    console.log("this is user's details:- ", user);
    return { message: "Login successful", status: 200, token };
}

export const ProfileRepository = async (userId: string) => {
    const userDetails = await db.select().from(User).where(eq(User.id, userId));
    return { message: "profile retured successfully", status: 200, user: userDetails[0] };
}

export const UpdateProfileRespository = async (userId: string, data: UserRegistrationSchema) => {
    try {
        const user = await db.select().from(User).where(eq(User.id, userId));
        if (user.length < 1) {
            return { message: "unable to find profile", status: 404 }
        }
        await db.update(User).set({
            name: data.name,
            email: data.email,
            address: data.address,
            phoneNo: data.phoneNo,
            updated_at: new Date()
        }).where(eq(User.id, userId))
        return { message: "profile updated Successfully", status: 200 }
    } catch (error) {
        return { message: "unable to find profile", status: 500 }
    }
}

export const DeleteProfileRepository = async (userId: string) => {
    try {
        const user = await db.select().from(User).where(eq(User.id, userId));
        if (user.length < 1) {
            return { message: "unable to find profile", status: 404 }
        }
        await db.delete(User).where(eq(User.id, userId));
        return { message: "profile delete successfully", status: 200 };
    } catch (error) {
        return { message: "some Invalid error has occured", status: 500 }
    }
}