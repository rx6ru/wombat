import { Router } from "express";

import {
    keyOnlyFetch,
    keyAddedLog,
    keyUpdatedLog,
    keyDeletedLog
} from "../middlewares/key.logs.middleware.js";

import {
    getKeysDetails,
    fetchKey,
    addKey,
    updateKey,
    deleteKey
} from "../controllers/key.controller.js";

import {
    validateCursor
} from "../middlewares/validate.cursor.middleware.js";

// import { fetchKeyLimiter } from "../middlewares/ratelimiters.middleware.js";

const router = Router();

router.get("/keys", validateCursor, getKeysDetails);

// router.get("/key/:id", fetchKeyLimiter, keyOnlyFetch, fetchKey);
router.get("/key/:id", keyOnlyFetch, fetchKey);

router.post("/key", keyAddedLog, addKey);

router.put("/key/:id", keyUpdatedLog, updateKey);

router.delete("/key/:id", keyDeletedLog, deleteKey);

export default router;