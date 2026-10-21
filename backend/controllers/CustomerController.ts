import type { Request, Response } from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";


const CustomerController = {

    async create (req: Request, res: Response) {
        if (    
            !req.body.FirstName ||
            !req.body.LastName ||
            !req.body.DisplayName ||
            !req.body.Password ||
            !req.body.PasswordConfirmation
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            })
        }  
        if (req.body.Password != req.body.PasswordConfirmation) 
            {
            return res.status(406)
            .send({error:"Passwords do not match, please check your info."})            
        } 

        const newCustomer = {
            CustomerID: uuidv7(),
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            DisplayName: req.body.DisplayName,
            Password: req.body.Password,
            OrderListID: uuidv7(),
            SignupDate: Date.now,
            UserStatus: "unverified",
            PasswordHash: ""
        }
        newCustomer.PasswordHash = await Utilities.gimmePassword(req.body.Password);

        const result = await db.customers.create(newCustomer);

         return res.location(`${Utilities.getBaseURL(req)}/customers/${result.id}`).sendStatus(201)

    },

    async getAll(req: Request, res: Response) { 
        const customers = await db.customers.findAll();
        return res.status(200).send(customers);
        },
}
