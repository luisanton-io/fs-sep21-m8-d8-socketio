import express from "express"
import UserModel from "./model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const usersRouter = express.Router();


usersRouter
    .post("/", async (req, res) => {
        try {
            console.log("BODY", req.body)
            const newUser = new UserModel(req.body)

            newUser.password = await bcrypt.hash(req.body.password, 12)
            await newUser.save()

            console.log(newUser)

            res.send(newUser)
        } catch (error) {
            res.status(400).send()
        }
    })
    .post("/login", async (req, res) => {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).send()
        }

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).send()
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const accessToken = `Bearer ${jwt.sign({ _id: user._id }, process.env.JWT_SECRET!)}`

            res.send({ accessToken })
        } else {
            res.status(403).send({ error: "Wrong credentials" })
        }
    })

export default usersRouter