import mongoose from "mongoose";
import httpServer from "./server";

process.env.TS_NODE_DEV && require("dotenv").config()

const { MONGO_URL } = process.env
if (!MONGO_URL) throw new Error("No Mongo URL provided")

mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB")
        httpServer.listen(3030, () => {
            console.log("Server listening on port " + 3030)
        });
    })
