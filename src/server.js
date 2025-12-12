import express from "express";
import userRoute from "./routes/userRoute.js";
import surveyRoute from "./routes/surveyRoute.js";
import questionRoute from "./routes/questionRoute.js";
import responseRoute from "./routes/responseRoute.js";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

const sessions = {};

io.on("connection", (socket) => {
  console.log("A user connected socket id:", socket.id);

  // Host creates a new survey room
  socket.on("createRoom", (data, callback) => {
    const { hostName, questions } = data;
    const roomCode = Math.random().toString(36).substring(2, 8); // e.g., "a1b2c3"
    sessions[roomCode] = {
      hostId: socket.id,
      participants: [],
      questions,
      currentIndex: 0,
    };
    socket.join(roomCode);
    console.log(`Room created with code: ${roomCode} by host: ${hostName}`);
    callback(roomCode);
  });

  // Participant joins a survey room
  socket.on("joinRoom", (roomCode, participantName, callback) => {
    const session = sessions[roomCode];
    if (session) {
      session.participants.push({ id: socket.id, name: participantName });
      socket.join(roomCode);
      console.log(`Participant ${participantName} joined room: ${roomCode}`);
      callback({ success: true, message: "Joined room successfully" });

      socket.emit("roomData", {
        roomCode,
        hostName: "sample host", // Placeholder as hostName is not stored
        questions: session.questions,
      });
    }
  });

  // Host advances to the next question
  socket.on("nextQuestion", (data) => {
    const { roomCode, questionIndex } = data;
    const session = sessions[roomCode];
    if (session) {
      session.currentIndex = questionIndex;
      socket.to(roomCode).emit("newQuestion", {
        currentIndex: session.currentIndex,
      });
    }
  });

  // Host ends the survey
  socket.on("endSurvey", (data) => {
    const { roomCode } = data;
    const session = sessions[roomCode];
    if (session) {
      io.in(roomCode).emit("surveyEnded");
      io.socketsLeave(roomCode);
      delete sessions[roomCode];
      console.log(`Survey ended for room: ${roomCode}`);
    }
  });

  // 🧹 Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
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
