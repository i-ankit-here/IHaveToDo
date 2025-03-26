import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubTodos,addSubTodo,deleteSubTodo,updateSubTodo } from "../controllers/subTodo.controller.js";

const router = Router();

router.route("/getSubTodos/:majorTodoId").get(verifyJWT,getSubTodos);
router.route("/todos/getSubTodos/:majorTodoId").post(verifyJWT,addSubTodo);
router.route("/todos/getSubTodos/:majorTodoId").delete(verifyJWT,deleteSubTodo);
router.route("/todos/getSubTodos/:majorTodoId").put(verifyJWT,updateSubTodo);

export default router;


