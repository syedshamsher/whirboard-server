"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const users = {};
io.on("connection", (socket) => {
    socket.on("client-ready", () => {
        socket.broadcast.emit("get-canvas-state");
    });
    socket.on("canvas-state", (state) => {
        console.log("received canvas state");
        socket.broadcast.emit("canvas-state-from-server", state);
    });
    socket.on("draw-line", (props) => {
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
server.listen(PORT || 3001, () => {
    console.log(`✔️ Server listening on port ${PORT || 3001}`);
});
