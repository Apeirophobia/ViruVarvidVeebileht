import type { Request, Response } from "express";
import { db } from "../db.ts"
import Utilities from "./Utilities.ts";
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
    },

    async getByID(req: Request, res: Response) {
        const serviceID: String = req.params.id as String;
        
        const service = await db.services.findByPk(serviceID);
    
        if (!service || service === undefined) {
            res.status(404).send(
                {
                    error: `Service with this ID is not found: ${serviceID}`
                });
            return null;
        }
        return service;
    },   

    async modifyByID(req: Request, res: Response) {
        const serviceToBeModified = await this.getByID(req, res);
        if (!serviceToBeModified) {
            return;
        }
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

        serviceToBeModified.ServiceName = req.body.ServiceName;
        serviceToBeModified.Price = req.body.Price;
        serviceToBeModified.Category = req.body.Category;
        serviceToBeModified.Description = req.body.Description;

        await serviceToBeModified.save();
        return res
        .location(`${Utilities.getBaseURL(req)}/services/${serviceToBeModified.ServiceID}`)
        .status(201)
        .send(serviceToBeModified);
    },
    async deleteByID(req: Request, res: Response) {
        const serviceToBeDeleted = await this.getByID(req, res);
        if (!serviceToBeDeleted) {
            return;
        }

        await serviceToBeDeleted.destroy();
        return res.status(204)
        .send({error: "No content"});
    }
    
}

export default ServicesController;