import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTodos,addTodo,deleteTodo, getTeam } from "../controllers/todo.controller.js";

const router = Router();

router.route("/getTodos").get(verifyJWT,getTodos);
router.route("/addTodo").post(verifyJWT,addTodo);
router.route("/deleteTodo/:id").delete(verifyJWT,deleteTodo);
router.route("/getTeam/:id").get(verifyJWT,getTeam);

export default router;