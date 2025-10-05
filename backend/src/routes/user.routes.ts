import { Router } from "express";
import { getUserInfo, updateUserInfo } from "../controllers/user.controller.js";

const router = Router();

router.get("/info/getUserInfo", getUserInfo);
router.put("/info/updateUserInfo", updateUserInfo);


export default router;