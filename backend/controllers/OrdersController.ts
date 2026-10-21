import { Request, Response } from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import {v7 as uuidv7} from "uuid";
import {error} from "node:console";
import { UUID } from "node:crypto";


const OrdersController = {
    async create(req: Request, res: Response) {
        if (!req.body.CustomerID ||
            !req.body.ServiceID
        ) {
            return res.status(400).send({error: "Missing parameters"});
        }

        let reqService = db.services.findByPk(req.body.ServiceID); // Find requested service
        let reqCustomer = db.customers.findByPk(req.body.CustomerID); // Find customer who requested
        
        

        const newOrder = {
            OrderID: uuidv7(),
            CustomerID: req.body.CustomerID,
            ServiceID: req.body.ServiceID,
            Price: reqService.Price, // Get price from service
            ServiceCategory: reqService.Category, // Get category from service
            CustomerName: reqCustomer.FirstName, // Get name from customer
            CustomerEmail: reqCustomer.Email, // NOT IMPLEMNTED 
            OrderedAt: Date.now() // Date
        }

        const addNewOrder = await db.orders.create(newOrder);
        
        return res.location(`${Utilities.getBaseURL(req)}/orders/${addNewOrder.OrderID}`);


    }
}