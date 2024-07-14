const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

const members = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
];

let isSpinning = false;
let spinTimeout;

io.on("connection", (socket) => {
  console.log("New client connected");

  // Send current state to newly connected client
  socket.emit("spinState", { isSpinning, result: null });

  socket.on("requestSpin", () => {
    if (!isSpinning) {
      isSpinning = true;
      const rotation = Math.floor(Math.random() * 360) + 1440; // At least 4 full spins
      io.emit("spinStart", { rotation });

      clearTimeout(spinTimeout);
      spinTimeout = setTimeout(() => {
        const result = members[Math.floor(Math.random() * members.length)];
        isSpinning = false;
        io.emit("spinResult", { result });
      }, 5000);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
