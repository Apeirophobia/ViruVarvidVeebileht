import { Request, Response } from "express";
import { db } from "../db.ts"
import Utilities from "./utilities.ts";
import { v7 as uuidv7 } from "uuid";

export const create = async (req: Request, res: Response) => {
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

    const createdService = await db.games.create(newService);
    return res
    .location(`${Utilities.getBaseURL(req)}/games/${createdService.ServiceID}`).sendStatus(201);

}