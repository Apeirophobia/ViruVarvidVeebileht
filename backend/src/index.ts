import "dotenv/config";
import express, { urlencoded } from "express";
// import dotenv from "dotenv";
import cors from "cors";

import swaggerUI from "swagger-ui-express";
// import swaggerDoc from "./docs/swagger.json" with {type: "json"}
import swaggerDoc from "./docs/swagger-autogen.json" with {type: "json"}

import { sync } from "./db.ts";
import appRoutes from "./routes/appRoutes.ts";
// dotenv.config();

const port = process.env.PORT //|| 8080;
const host =  "localhost";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(urlencoded({
    extended: true
}));

appRoutes(app);

app.listen(port, async() => {
    if (process.env.SYNC === "true") {
        await sync();
    }

    console.log(`API running on: http://${host}:${port}/`);
})