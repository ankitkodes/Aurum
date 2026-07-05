import { Router } from "express";
import { DeleteProfile, Login, Profile, Register, UpdateProfile } from "./user.controller.js";
import { authenticate } from "../../shared/middleware/Authentication.js";

const router = Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/getProfile/:userId", authenticate, Profile);
router.put("/update/:userId", authenticate, UpdateProfile);
router.delete("/delete/:userId", authenticate, DeleteProfile);

export const UserRoutes = router;
