import type { Request, Response } from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";

const ContactsController = {
    async create(req: Request, res: Response) {
        if (!req.body.UserName || 
        !req.body.EmailAddress ||
        !req.body.Password ||
        !req.body.PasswordConfirmation) {
            return res.status(400)
            .send({error:"Missing parameters, please check your info."})
        }
        if (req.body.Password != req.body.PasswordConfirmation) 
            {
            return res.status(406)
            .send({error:"Passwords do not match, please check your info."})            
        }
        const newUser = {
            id: uuidv7(),
            UserName: req.body.UserName,
            EmailAddress: req.body.EmailAddress,
            SignupDate: Date.now,
            UserStatus: "unverified",
            PasswordHash: ""
        }
        newUser.PasswordHash = await Utilities.gimmePassword(req.body.Password)

        const result = await db.contacts.create(newUser);

        return res.location(`${Utilities.getBaseURL(req)}/contacts/${result.id}`).sendStatus(201)
    },

    async getAll(req: Request, res: Response) {
        const contacts = await db.contacts.findAll();
        return res.status(200).send(contacts);
    },

    async getById(req: Request, res: Response) {
        const contact = await db.contacts.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).send({ error: "Contact not found" });
        }

        return res.status(200).send(contact);
    },

    async updateById(req: Request, res: Response) {
        const contact = await db.contacts.findByPk(req.params.id);

        if (!contact) {
            return res.status(404).send({ error: "Contact not found" });
        }

        if (!req.body.Name || !req.body.Email || !req.body.PhoneNumber) {
            return res.status(400).send({ error: "Parameter missing" });
        }

        contact.Name = req.body.Name;
        contact.Email = req.body.Email;
        contact.PhoneNumber = req.body.PhoneNumber;

        await contact.save();

        return res.status(200).send(contact);
    }
} 

export default ContactsController;