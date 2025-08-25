import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubTodos,addSubTodo,deleteSubTodo,updateSubTodo,setNotes } from "../controllers/subTodo.controller.js";
import { getAuthenticatedClientloose } from "../middlewares/getAuthClient.middleware.js";

const router = Router();

router.route("/getSubTodos/:majorTodoId").get(verifyJWT,getSubTodos);
router.route("/addSubTodo").post(verifyJWT,getAuthenticatedClientloose,addSubTodo);
router.route("/deleteSubTodo").delete(verifyJWT,getAuthenticatedClientloose,deleteSubTodo);
router.route("/updateSubTodo").put(verifyJWT,getAuthenticatedClientloose,updateSubTodo);
router.route("/setNotes").post(verifyJWT,getAuthenticatedClientloose,setNotes);

export default router;


