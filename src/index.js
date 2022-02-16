import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import RoomModel from "./rooms/model.js";

let onlineUsers = []


const app = express();

app.use(cors())

app.get('/test', function (req, res) {
    res.send({ message: 'Hello' })
})

app.get('/online-users', (req, res) => {
    res.send({ onlineUsers })
})

app.get('/chats/:room', async (req, res) => {
    const room = await RoomModel.findOne({ name: req.params.room })

    res.send({ messages: room.messages })
})

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


io.on("connection", (socket) => {
    console.log(socket.id, socket.rooms)

    socket.on("setUsername", ({ username, room }) => {
        console.log(username)

        socket.join(room)

        onlineUsers.push({ username, id: socket.id, room })

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
        onlineUsers = onlineUsers.filter(u => u.id !== socket.id)
    })
});

mongoose.connect("mongodb://localhost/chat", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB")
        httpServer.listen(3030, () => {
            console.log("Server listening on port " + 3030)
        });
    })