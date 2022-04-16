import { NextFunction, Response } from "express";
import { autoInjectable } from "tsyringe";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithoutData } from "../interfaces/response.interface";
import { decodeJwtToken } from "../shared/functions";

@autoInjectable()
export class AuthMiddleware {
    public isUserLoggedIn(req: AuthenticatedRequest, res: Response, next: NextFunction)
    {
        const authHeader = req.headers.authorization;
        
        if (!authHeader)
        {
            const response: ResponseWithoutData = {
                message: 'Access denied. You need to login',
                statusCode: 401,
                success: false
            }
            return res.status(response.statusCode).json(response);
        }
        try{
            const user = decodeJwtToken(authHeader.split(' ')[1],process.env.JWT_SECRET_KEY);
            req.jwtPayload = user; 
            next();
        }
        catch(error)
        {
            const response: ResponseWithoutData = {
                message: 'Token has expired or has been tampered',
                statusCode: 401,
                success: false
            }
            return res.status(response.statusCode).json(response);
        }
    }
}