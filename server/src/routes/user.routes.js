import { Router } from "express";
import {registerUser,loginUser,logoutUser,regenerateAccessToken,getUser,updatePassword} from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middleware.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"),registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/regenerate").get(regenerateAccessToken)
router.route("/getUser").get(verifyJWT,getUser);
router.route("/updatePassword").post(verifyJWT,updatePassword);



export default router;  

 