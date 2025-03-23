import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTodos,addTodo,deleteTodo } from "../controllers/todo.controller.js";

const router = Router();

router.route("/getTodos").get(verifyJWT,getTodos);
router.route("/addTodo").post(verifyJWT,addTodo);
router.route("/deleteTodo/:id").delete(verifyJWT,deleteTodo);

export default router;