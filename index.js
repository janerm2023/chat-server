require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RegisterRoute = require("./Routes/Register");
const LoginRoute = require("./Routes/Login");
const Users = require("./Routes/Users");
const SendMessage = require("./Routes/SendMessage");
const ReceiveMessage = require("./Routes/ReceiveMessage");
const { MessageChannel } = require("worker_threads");
const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/", RegisterRoute);
app.use("/", LoginRoute);
app.use("/", Users);
app.use("/", SendMessage);
app.use("/", ReceiveMessage);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
// INTEGRATING SOCKET.IO
let users = [];

const addUsers = (userId, socketId) => {
  !users.some((user) => user.id === userId) &&
    users.push({
      userId,
      socketId,
    });
};

const removeUser = (socketId) => {
  return (users = users.filter((user) => user.socketId !== socketId));
};

const getUser = (toId) => {
  return users.find((user) => user.userId === toId);
};

io.on("connection", (socket) => {
  // When connected
  // After connection,take userID and socketID
  socket.on("addUser", (userId) => {
    addUsers(userId, socket.id);
    io.emit("onlineUsers", users);
  });

  // Send and Get Messages
  socket.on("sendMessage", ({ toId, fromId, message }) => {
    // Find the receiver ID
    const user = getUser(toId);
    // Then send message
    io.to(user.socketId).emit("getMessage", {
      fromSelf: false,
      fromId,
      message,
    });
  });

  // When disconnnect
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});
