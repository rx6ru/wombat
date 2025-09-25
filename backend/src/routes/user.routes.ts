import { Router } from "express";
import { getUserInfo, updateUserInfo } from "../controllers/user.controller.js";

const router = Router();

router.get("/info", getUserInfo);
router.put("/info", updateUserInfo);


export default router;