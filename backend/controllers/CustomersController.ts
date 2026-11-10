import * as express from "express";
import { db } from "../src/db.ts"
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";
import type { Identifier } from "sequelize";
import type { Customer } from "../src/models/customer.js";


const CustomersController = {

    async create (req: express.Request, res: express.Response) {
        console.log(req.body);
         if (    
             !req.body.FirstName ||
             !req.body.LastName ||
             !req.body.DisplayName ||
             !req.body.Email ||
             !req.body.Password ||
             !req.body.PasswordConfirmation
         ) {
             return res.status(400).send({
                 error: "Missing parameters (FirstName, LastName, DisplayName, Email, Password, PasswordConfirmation), please review data"
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
            Email: req.body.Email,
            Password: req.body.Password,
            OrderListID: uuidv7(),
            SignupDate: Date.now,
            UserStatus: "unverified",
            PasswordHash: ""
        }
        newCustomer.PasswordHash = await Utilities.gimmePassword(req.body.Password);

        const result = await db.customers.create(newCustomer);

         return res.location(`${Utilities.getBaseURL(req)}/customers/${result.CustomerID}`).sendStatus(201)

    },

    async getByID(req: express.Request, res: express.Response) {
        const customerID: string = req.params.id as string;
        console.log(customerID);
        const customer = await CustomersController.getCustomer(req, res);

        if(!customer) {
            return;
        }
        return res.status(200).send(customer);
    },

    async getAll(req: express.Request, res: express.Response) { 
        const customers = await db.customers.findAll();
        return res.status(200).send(customers);
    },

    async modifyByID(req: express.Request, res: express.Response) {
        const customerToBeModified = await CustomersController.getCustomer(req, res);
        if (!customerToBeModified) {
            return;
        }
        if (    
            !req.body.FirstName ||
             !req.body.LastName ||
             !req.body.DisplayName ||
             !req.body.Email
            
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            })
        }   

        customerToBeModified.FirstName = req.body.FirstName;
        customerToBeModified.LastName = req.body.LastName;
        customerToBeModified.DisplayName = req.body.DisplayName;
        customerToBeModified.Email = req.body.Email;

        await customerToBeModified.save();
        return res
        .location(`${Utilities.getBaseURL(req)}/customers/${customerToBeModified.CustomerID}`)
        .status(201)
        .send(customerToBeModified);
    },
    
    async deleteByID(req: express.Request, res: express.Response) {
        const customerToBeDeleted = await CustomersController.getCustomer(req, res);

        if (!customerToBeDeleted) {
            return;
        }

        await customerToBeDeleted.destroy();
        return res.status(204)
        .send({message: "No content"});
    },

    async getCustomer(req: express.Request, res: express.Response) {
        let customerID: string = req.params.id as string;
        const customer = await db.customers.findByPk(customerID);

        if (!customer) {
            res.status(404).send({
                error: `Customer with ID ${customerID} not found`
            });
            return null;
        }
        return customer;
    }
}

export default CustomersController;
