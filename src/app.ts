import cors from "cors";
import express from "express";
import jwtAuth from "./middlewares/jwtAuth";
import RoomModel from "./rooms/model";
import { shared } from "./shared";
import usersRouter from "./users";

const app = express();

app.use(express.json())

app.use(cors())

app.get('/test', jwtAuth, function (req, res) {
    res.send({ message: 'Hello world' })
})

app.get('/online-users', (req, res) => {
    res.send({ onlineUsers: shared.onlineUsers })
})

app.get('/chats/:room', async (req, res) => {
    const room = await RoomModel.findOne({ name: req.params.room })

    if (!room) return res.status(404).send({})

    res.send({ messages: room.messages })
})
app.use("/users", usersRouter)
export default app