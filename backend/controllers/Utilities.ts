import { Request } from "express";
//installi bcrypt hiljem, siia tuleb hashing ka

const Utilities = {
    getBaseURL(req: Request): string {
    return `${req.protocol}://${req.get("host")}`;
    },
    async gimmePassword(password: string): Promise<string> {
        
        return null
    }
}


export default Utilities