import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubTodos,addSubTodo,deleteSubTodo,updateSubTodo,setNotes } from "../controllers/subTodo.controller.js";
import { getAuthenticatedClient } from "../middlewares/getAuthClient.middleware.js";

const router = Router();

router.route("/getSubTodos/:majorTodoId").get(verifyJWT,getSubTodos);
router.route("/addSubTodo").post(verifyJWT,getAuthenticatedClient,addSubTodo);
router.route("/deleteSubTodo").delete(verifyJWT,getAuthenticatedClient,deleteSubTodo);
router.route("/updateSubTodo").put(verifyJWT,getAuthenticatedClient,updateSubTodo);
router.route("/setNotes").post(verifyJWT,setNotes)

export default router;


