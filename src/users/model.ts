import mongoose from "mongoose"

const UserSchema = new mongoose.Schema<User>({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const UserModel = mongoose.model("users", UserSchema)

export default UserModel