import dotenv from "dotenv"
dotenv.config()

import supertest from "supertest"
import app from "../app"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const request = supertest(app)

describe("Testing Jest...", () => {
    it("should work", () => {
        expect(true).toBe(true)
    })
})


describe("Testing endpoints...", () => {

    beforeAll(done => {
        const { MONGO_URL_TEST } = process.env

        if (!MONGO_URL_TEST) throw new Error("No Mongo URL provided")

        mongoose.connect(MONGO_URL_TEST)
            .then(() => {
                console.log("Connected to MongoDB")
                done()
            })
    })

    afterAll(done => {
        mongoose.connection.dropDatabase()
            .then(() => {
                return mongoose.connection.close()
            })
            .then(() => { done() })
        // mongoose.connection.close()
    })

    const validCredentials = {
        email: "hello@luisanton.io",
        password: "Password.123!"
    }

    let userId: string
    let token: string

    it("should return a valid user on POST /users with valid credentials", async () => {
        const response = await request.post("/users").send(validCredentials)

        expect(response.body._id).toBeDefined()
        userId = response.body._id
    })

    it("should return a valid jwt token when we login with valid credentials", async () => {
        const response = await request.post("/users/login").send(validCredentials)
        console.log(response.body)
        expect(response.body.accessToken).toBeDefined()

        const { _id } = jwt.verify(response.body.accessToken.split(" ")[1], process.env.JWT_SECRET!) as { _id: string }

        expect(_id).toBe(userId)

        token = response.body.accessToken

    })


    it("should test that the GET /test endpoint returns a 'Hello world' message only when authenticated", async () => {
        const response = await request.get("/test").set("Authorization", token)
        expect(response.body.message).toBe("Hello world")
    })

})