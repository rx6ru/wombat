import { Router } from "express";

import { createRateLimiter } from "../middlewares/rateLimiter.js";

import {
    keyOnlyFetchLog,
    keyAddedLog,
    keyUpdatedLog,
    keyDeletedLog
} from "../middlewares/key.logs.middleware.js";

import {
    getKeysDetails,
    searchKeys,
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

const standardRL=createRateLimiter( 10, "10 s");
const strictRL=createRateLimiter(3, "5 s");

router.get("/keys", standardRL, validateCursor, getKeysDetails);

router.get("/keys/search", validateCursor, searchKeys);

// router.get("/key/:id", fetchKeyLimiter, keyOnlyFetch, fetchKey);
router.get("/key/:id", strictRL, keyOnlyFetchLog, fetchKey);

router.post("/key", keyAddedLog, addKey);

router.put("/key/:id", keyUpdatedLog, updateKey);

router.delete("/key/:id", keyDeletedLog, deleteKey);

export default router;