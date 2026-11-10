import * as express from "express";

const checkRequestBody = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.body) {
        return res.status(400).json({error: "Request body is missing or empty"});
    }
    next();
}

export default checkRequestBody;