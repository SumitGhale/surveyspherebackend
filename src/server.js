import express from "express";
import userRoute from "./routes/userRoute.js";
import surveyRoute from "./routes/surveyRoute.js";
import questionRoute from "./routes/questionRoute.js";
import responseRoute from "./routes/responseRoute.js";
import { createServer } from "node:http";
import {Server} from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected socket id:", socket.id);
});

//  store in express app instance
app.set("io", io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoute); // Route to users
app.use("/surveys", surveyRoute); // Route to surveys
app.use("/questions", questionRoute); // Route to questions
app.use("/responses", responseRoute); // Route to responses

server.listen(8000, () => {
  console.log("Server started on port 8000");
});
