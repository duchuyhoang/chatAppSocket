import {Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";


export const verifyToken = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1] || null;
    if (token === null || token === "" || token === undefined) res.status(401).json({ message: "Unauthorized" });

    else {

        jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decode) => {
            // console.log("decode",decode);
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            }
            else {
                req.body.id = decode?.id || null;
                req.body.email = decode?.email || null;
                // Return a old token info
                res.locals.oldTokenInfo=decode
                // req.body.oldTokenInfo = decode;
                // req.oldTokenInfo=decode;
                next();
            }

        })

    }


}