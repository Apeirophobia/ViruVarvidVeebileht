import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();


const doc = {
    info: {
        title: "My Contacts API",
        description: "Description",
        version: "1.0.0"
    },
    host: process.env.HOST+":"+process.env.PORT,
    tags: [{name: 'Contacts'}, {name: 'lallalal'}]
}

const outputFile = '../docs/swagger-autogen.json';
const routes = ['../routes/appRoutes.ts'];

swaggerAutogen()(outputFile, routes, doc);
