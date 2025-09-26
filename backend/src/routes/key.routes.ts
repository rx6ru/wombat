import { Router } from "express";
import { keyAddedLog, keyUpdatedLog, keyDeletedLog } from "../middlewares/key.logs.middleware.js";
import { getKeys, addKey, updateKey, deleteKey } from "../controllers/key.controller.js";

const router = Router();

router.get("/keys", getKeys);

router.post("/key", keyAddedLog,addKey);

router.put("/key", keyUpdatedLog, updateKey);

router.delete("/key", keyDeletedLog, deleteKey);

export default router;