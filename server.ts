const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

import { Server } from "socket.io";
import config from "./config.json";
import { DrawLineProps } from "./types";
import { Users } from "./interface";

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const users: Users = {};

io.on("connection", (socket) => {
  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    console.log("received canvas state");
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("draw-line", (props: DrawLineProps) => {
    socket.broadcast.emit("draw-line", props);
  });

  socket.on("update-cursor-position", (position) => {
    // Store the user's cursor position
    users[socket.id] = position;
    console.log(users, "users positions");

    // Broadcast positions to all connected clients
    socket.broadcast.emit("update-cursors", users);
  });

  socket.on("disconnect", () => {
    // Remove the user's cursor position when they disconnect
    delete users[socket.id];
    // Broadcast updated positions to all clients
    io.emit("update-cursors", users);
    console.log("Client disconnected");
  });

  socket.on("clear", () => io.emit("clear"));
});

server.listen(config?.port || 3001, () => {
  console.log(`✔️ Server listening on port ${config?.port || 3001}`);
});
