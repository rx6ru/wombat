import { Router } from "express";

const router = Router();

const getKeys = () => {
    console.log("getKeys");
};

const addKey = () => {
    console.log("addKey");
};

const updateKey = () => {
    console.log("updateKey");
};

const deleteKey = () => {
    console.log("deleteKey");
};

export { getKeys, addKey, updateKey, deleteKey };