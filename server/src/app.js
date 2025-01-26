import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

var whitelist = ['http://localhost/5173','http://localhost/8000']
var corsOptions = {
  origin: function (origin, callback) {
    // console.log(origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true}))

app.use(express.static("public"));

app.use(cookieParser());

//importing routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users",userRouter);

export default app;