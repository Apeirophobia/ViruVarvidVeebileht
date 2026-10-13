import { Request, Response } from "express";
import { db } from "../db.ts"
import Utilities from "./utilities.ts";
import { v7 as uuidv7 } from "uuid";

const ServicesController = {

    async create (req: Request, res: Response) {
        if (    
            !req.body.ServiceName ||
            !req.body.Price ||
            !req.body.Category ||
            !req.body.Description
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            })
        }   

        const newService = {
            ServiceID: uuidv7(),
            ServiceName: req.body.ServiceName,
            Description: req.body.Description,
            Price: req.body.Price,
            Category: req.body.price,
        }

        const createdService = await db.services.create(newService);
        return res
        .location(`${Utilities.getBaseURL(req)}/games/${createdService.ServiceID}`).sendStatus(201);

    },

    async getAll(req: Request, res: Response) {
        const services = await db.services.findAll();
        console.log("getAll: ", services);
        return res
        .status(200)
        .send(
            services.map(
                (
                    ({ServiceID, ServiceName}) => { return {ServiceID, ServiceName}}
                )
            )
        )
    }

}

export default ServicesController;