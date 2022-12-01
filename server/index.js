const express = require("express");
const app = express();
const { Server } = require("socket.io");

const cors = require("cors");

app.use(cors);

const server = require("http").createServer(app);
const PORT = 3001;

const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log(`User Connected: ${socket.id}`);

	socket.on("join_room", (data) => {
		socket.join(data);
		console.log(`User with ID: ${socket.id} joined room: ${data}`);
	});

	socket.on("send_message", (data) => {
		socket.to(data.room).emit("receive_message", data);
	});

	socket.on("disconnect", () => {
		console.log("User disconnected", socket.id);
	});
});

server.listen(PORT, () => {
	console.log("listening to port", PORT);
});
