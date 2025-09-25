import { Router } from "express";

const router = Router();

const getUserInfo = () => {
    console.log("getUserInfo");
};
const updateUserInfo = () => {
    console.log("updateUserInfo");
};

export { getUserInfo, updateUserInfo };