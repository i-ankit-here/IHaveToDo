import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

var whitelist = ['http://localhost:5173','http://localhost:8000',"https://ihavtodo.netlify.app"]
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"));

app.use(cookieParser());

//importing routes
import userRouter from "./routes/user.routes.js";
import todoRoutes from "./routes/todo.routes.js"
import subTodoRoutes from "./routes/subTodo.routes.js"
import inviteRoutes from "./routes/invite.routes.js";
app.use("/api/v1/users",userRouter);
app.use("/api/v1/todos",todoRoutes);
app.use("/api/v1/subTodos",subTodoRoutes);
app.use("/api/v1/invite", inviteRoutes);

export default app;