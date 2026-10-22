import "dotenv/config";
import express from "express";
// import dotenv from "dotenv";
import cors from "cors";
import { sync } from "../db.ts";
import appRoutes from "../routes/appRoutes.ts";

// dotenv.config();

const port = process.env.PORT //|| 8080;
const host =  "localhost";

const app = express();

app.use(cors());
app.use(express.json());

appRoutes(app);

app.listen(port, async() => {
    if (process.env.SYNC === "true") {
        await sync();
    }

    console.log(`API running on: http://${host}:${port}/`);
})