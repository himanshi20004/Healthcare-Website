import { Server } from "socket.io";

export const config = {
  runtime: "nodejs",  
};

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Socket.io server starting...");

    io = new Server(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("join_room", (roomId) => {
        socket.join(roomId);
      });

      socket.on("send_message", (data) => {
        io.to(data.roomId).emit("receive_message", data);
      });
    });
  }

  res.end();
}
