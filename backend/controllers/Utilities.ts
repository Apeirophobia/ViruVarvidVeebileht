import { Request } from "express";

export const getBaseURL = (req: Request): string => {
    return `${req.protocol}://${req.get("host")}`;
}
