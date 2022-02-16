import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema({
    text: String,
    sender: String,
    timestamp: Number,
    id: String
})

const RoomSchema = new mongoose.Schema({
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