import * as express from "express";
import { db } from "../db.ts";
import Utilities from "./Utilities.ts";
import { v7 as uuidv7 } from "uuid";
import { User } from "../models/user.ts"

const UsersController = {

    //update for standards
    async create(req: express.Request, res: express.Response) {

        const requiredFields = ['UserName', 'EmailAddress', 'Password', 'PasswordConfirmation'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        console.log(req.body)
        if (missingFields.length > 0) {
            return res.status(400).send({
                error: "Missing parameters, please review data",
                missing: missingFields
            });
        }
        if (req.body.Password != req.body.PasswordConfirmation) 
            {
            return res.status(406)
            .send({error:"Passwords do not match, please check your info."})            
        }

        const passwordHash = await Utilities.gimmePassword(req.body.Password)

        const result = await db.users.create({
            id: uuidv7(),
            UserName: req.body.UserName,
            EmailAddress: req.body.EmailAddress,
            UserStatus: "unverified",
            PasswordHash: passwordHash
        });

        return res.location(`${Utilities.getBaseURL(req)}/users/${result.id}`)
        .send({"OK":"OK"}).status(201);

    },
    async getAll(req: express.Request, res: express.Response) {
        const users = await db.users.findAll();
        console.log("getAll"+users)
        return res.status(200).send(users.map(
            ({id, UserName, UserStatus, EmailAddress }) => {return {id, UserName, UserStatus, EmailAddress}}
        ))
    },
    async getById(req: express.Request, res: express.Response) {
        const user = await UsersController.getUser(req, res)
        if (!user) {
            return
        }
        return res.status(200).send(user)
    },

    //update for standards
    async modifyById(req: express.Request, res: express.Response) {
        // #swagger.tags = ['Users']
        const requiredFields = ['UserName', 'EmailAddress', 'Password', 'PasswordConfirmation'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return res.status(400).send({
                error: "Missing parameters, please review data",
                missing: missingFields
            });
        }

        if (!req.params.id) {
            return res.status(400).send({"error":"No id supplied"})
        }
        console.log("++++++ id is"+req.params.id)
        const userToBeModified = await UsersController.getUser(req, res) as User
        console.log("++++++ user is"+userToBeModified)
        if (!req.body) {
            return res.status(400).send({"error":"No body was supplied, nothing was changed"})
        }

        console.log("++++++ body: "+req.body)
        
        const modifiedUser = {
            UserName: req.body.UserName,
            PasswordHash: req.body.PasswordHash,
            EmailAddress: req.body.EmailAddress,
            SignupDate: req.body.SignupDate,
            UserStatus: req.body.UserStatus,
            UserCollectionID: req.body.UserCollectionID,
            ReviewListID: req.body.ReviewListID,
            ProfileID: req.body.ProfileID,
            CredentialID: req.body.CredentialID,
            createdAt: req.body.createdAt,
        }

        //TODO: add if ladder for checking new data in comparison with existing one.
        //not doing the todo rn, jv2910'26
        
        if (req.body.Password) {
            //kontrolli olemasoleva paswordi hashide samasust
            if (req.body.Password != req.body.PasswordConfirmation) 
            {
            return res.status(406)
            .send({error:"Passwords do not match, please check your info."})            
            } else {
                const passwordHash = await Utilities.gimmePassword(req.body.Password)
                modifiedUser.PasswordHash = passwordHash
            }
            //kui ok, siis proceed
            //hashi uus password
        }        
        userToBeModified.updatedAt = new Date()

        console.log("++++++ modifieduser is: "+userToBeModified)
        await db.users.update(modifiedUser, {
            where: {
                id: req.params.id
            }
        })
        return res.location(`${Utilities.getBaseURL(req)}/users/${userToBeModified}`).status(201).send(modifiedUser)
    },
    async deleteById(req: express.Request, res: express.Response) {
        const userToBeDeleted = await UsersController.getUser(req, res)
        if (!userToBeDeleted) {
            return            
        }
        await userToBeDeleted.destroy();
        return res.status(204).send({error :"No Content"})
    },
    async getUser(req: express.Request, res: express.Response) {
        let userID: string = req.params.id as string
        //console.log(userID)
        const user = await db.users.findByPk(userID);
        if(!user) {
            res.status(404).send(
                {
                    error: `user with this id does not exist: ${userID}`
                }
            )
            return null;
        }
        return user;
    }
}
export default UsersController