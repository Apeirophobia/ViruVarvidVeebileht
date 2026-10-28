import * as express from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";

const ContactsController = {

    async create(req: express.Request, res: express.Response) {
        if (
            !req.body.Name ||
            !req.body.Email ||
            !req.body.PhoneNumber
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        const newContact = {
            ContactID: uuidv7(),
            Name: req.body.Name,
            Email: req.body.Email,
            PhoneNumber: req.body.PhoneNumber,
        };

        const createdContact = await db.contacts.create(newContact);
        return res
            .location(`${Utilities.getBaseURL(req)}/contacts/${createdContact.ContactID}`)
            .sendStatus(201);
    },

    async getAll(req: express.Request, res: express.Response) {
        const contacts = await db.contacts.findAll();
        return res.status(200).send(
            contacts.map(({ ContactID, Name }) => ({ ContactID, Name }))
        );
    },

    async getByID(req: express.Request, res: express.Response) {
        const contact = await ContactsController.getContact(req, res);
        if (!contact) {
            return;
        }
        return res.status(200).send(contact);
    },

    async modifyByID(req: express.Request, res: express.Response) {
        const contactToBeModified = await ContactsController.getContact(req, res);
        if (!contactToBeModified) {
            return;
        }

        if (
            !req.body.Name ||
            !req.body.Email ||
            !req.body.PhoneNumber
        ) {
            return res.status(400).send({
                error: "Missing parameters, please review data"
            });
        }

        contactToBeModified.Name = req.body.Name;
        contactToBeModified.Email = req.body.Email;
        contactToBeModified.PhoneNumber = req.body.PhoneNumber;

        await contactToBeModified.save();
        return res
            .location(`${Utilities.getBaseURL(req)}/contacts/${contactToBeModified.ContactID}`)
            .status(200)
            .send(contactToBeModified);
    },

    async deleteByID(req: express.Request, res: express.Response) {
        const contactToBeDeleted = await ContactsController.getContact(req, res);
        if (!contactToBeDeleted) {
            return;
        }

        await contactToBeDeleted.destroy();
        return res.sendStatus(204);
    },

    async getContact(req: express.Request, res: express.Response) {
        const contactID: string = req.params.id as string;
        const contact = await db.contacts.findByPk(contactID);

        if (!contact) {
            res.status(404).send({
                error: `Contact with this ID is not found: ${contactID}`
            });
            return null;
        }

        return contact;
    }
}

export default ContactsController;