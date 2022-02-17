import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";
import RoomModel from "./rooms/model";
import { shared } from "./shared";

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on("connection", (socket) => {
    console.log(socket.id, socket.rooms)

    socket.on("setUsername", ({ username, room }) => {
        console.log(username)

        socket.join(room)

        shared.onlineUsers.push({ username, id: socket.id, room })

        socket.emit('loggedin')
        socket.broadcast.emit('newConnection')
    })

    socket.on("sendmessage", async ({ message, room }) => {

        try {
            await RoomModel.findOneAndUpdate({ name: room }, {
                $push: { messages: message }
            })

            socket.to(room).emit("message", message)

        } catch (error) {
            socket.emit("error", { error: "Can't save to DB. Try again later." })
        }

    })

    socket.on("disconnect", () => {
        shared.onlineUsers = shared.onlineUsers.filter(u => u.id !== socket.id)
    })
});

export default httpServer