import { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import UserModel from "../users/model"

const jwtAuth: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) return res.status(401).send({ error: "No token provided" })

    const { _id } = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string }

    const user = await UserModel.findById(_id)

    if (!user) return res.status(401).send({ error: "Invalid token" })

    req.user = user

    next()
}

export default jwtAuth