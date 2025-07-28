import { Router } from "express";
import {registerUser,loginUser,logoutUser,regenerateAccessToken,getUser,updatePassword, updateUser,getUserByIds,getUserById} from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/regenerate").get(regenerateAccessToken)
router.route("/getUser").get(verifyJWT,getUser);
router.route("/updatePassword").put(verifyJWT,updatePassword);
router.route("/updateProfile").put(verifyJWT,updateUser);
router.route("/getUsersByIds").post(verifyJWT, getUserByIds);
router.route("/getUsersById/:userId").get(verifyJWT, getUserById);



export default router;  

 