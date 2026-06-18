import { Router } from "express";
import { DeleteProfile, Login, Profile, Register, UpdateProfile } from "./user.controller.js";
const router = Router();
router.post("/register", Register);
router.post("/login", Login);
router.get("/getProfile/:userId", Profile);
router.put("/update/:userId", UpdateProfile);
router.delete("/delete/:userId", DeleteProfile);
export const UserRoutes = router;
