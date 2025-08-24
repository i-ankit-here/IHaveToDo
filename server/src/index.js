import 'dotenv/config'
import connectDB from "./db/db.js"
import app from './app.js';
import http from 'http';
import { Server } from 'socket.io';
//importing routes
import userRouter from "./routes/user.routes.js";
import todoRoutes from "./routes/todo.routes.js"
import subTodoRoutes from "./routes/subTodo.routes.js"
import inviteRoutes from "./routes/invite.routes.js";
import googleAuthRoutes from "./routes/googleAuth.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import conversationRoutes from "./routes/coversation.routes.js";
import { Message } from './models/message.model.js';

connectDB()
    .then(() => {
        // Create the HTTP server using your Express app
        const httpServer = http.createServer(app);

        // Create a new Socket.IO server instance and configure CORS
        const io = new Server(httpServer, {
            cors: {
                origin: function (origin, callback) {
                    // whitelist from app.js for consistency
                    const whitelist = ['http://localhost:5173', 'http://localhost:8000', "https://ihavtodo.netlify.app"];
                    if (!origin || whitelist.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true
            }
        });

        // Make `io` accessible to all your API routes by attaching it to the request object
        app.use((req, res, next) => {
            req.io = io;
            next();
        });

        // Set up the main listener for new socket connections
        io.on("connection", (socket) => {
            console.log(`✅ User connected: ${socket.id}`);
            
            socket.on('join_conversation', (id) => {
                socket.join(id);
                console.log(`User ${socket.id} joined chat: ${id}`);
            });

            socket.on('sendMessage', async (msg) => {
                console.log(`User ${socket.id} sent a message: ${msg}`);
                const newmsg = await Message.create(msg);
                console.log(newmsg);
                io.to(newmsg?.conversationId?.toString()).emit('receiveMessage', newmsg);

            });
            socket.on("disconnect", () => {
                console.log(`❌ User disconnected: ${socket.id}`);
            });
        });


        app.use("/api/v1/users", userRouter);
        app.use("/api/v1/todos", todoRoutes);
        app.use("/api/v1/subTodos", subTodoRoutes);
        app.use("/api/v1/invite", inviteRoutes);
        app.use("/api/v1/auth/google", googleAuthRoutes);
        app.use("/api/v1/calendar", calendarRoutes);
        app.use("/api/v1/conversations", conversationRoutes);

        // This error listener for the app is still good to have
        app.on("error", (error) => {
            console.error("Error accured while creating app: ", error);
            throw error;
        })

        // IMPORTANT: Start the httpServer, not the Express app
        httpServer.listen(process.env.PORT || 8010, () => {
            console.log(`🚀 App is listening on port: ${process.env.PORT || 8010}`)
        });
    })
    .catch((error) => {
        console.error("Error Connecting to Database ", error);
    });











































/*
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    } catch (error) {
        console.error("ERROR: ",error);
        throw error;
    }
})()
*/