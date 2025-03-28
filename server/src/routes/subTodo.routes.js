import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubTodos,addSubTodo,deleteSubTodo,updateSubTodo } from "../controllers/subTodo.controller.js";

const router = Router();

router.route("/getSubTodos/:majorTodoId").get(verifyJWT,getSubTodos);
router.route("/addSubTodo").post(verifyJWT,addSubTodo);
router.route("/deleteSubTodo").delete(verifyJWT,deleteSubTodo);
router.route("/updateSubTodo").put(verifyJWT,updateSubTodo);

export default router;


