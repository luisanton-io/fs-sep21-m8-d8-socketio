import mongoose from "mongoose"

interface Message {
    text: string;
    sender: string;
    timestamp: number;
    id: string;
}

const MessageSchema = new mongoose.Schema<Message>({
    text: String,
    sender: String,
    timestamp: Number,
    id: String
})

interface Room {
    name: string;
    messages: Message[]
}

const RoomSchema = new mongoose.Schema<Room>({
    name: {
        type: String,
        required: true
    },
    messages: {
        type: [MessageSchema],
        required: true
    }
})

const RoomModel = mongoose.model("rooms", RoomSchema)

export default RoomModel