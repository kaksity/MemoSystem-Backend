import { NextFunction, Response } from "express";
import { autoInjectable } from "tsyringe";
import { User } from "../entity/User";
import { IJwtPayload } from "../interfaces/jwt.interfaces";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithoutData } from "../interfaces/response.interface";
import { decodeJwtToken } from "../shared/functions";

@autoInjectable()
export class AuthMiddleware {
    public async isUserLoggedIn(req: AuthenticatedRequest, res: Response, next: NextFunction)
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
            
            const user = decodeJwtToken(authHeader.split(' ')[1],process.env.JWT_SECRET_KEY) as IJwtPayload;
            
            const userQuery = await User.findOne({
                where:{
                    id: user.userId
                }
            })

            req.role = user.role;
            req.user = userQuery; 
            
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
    public isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction)
    {
        try{

            if(req.role === 'admin'){
                next();
            }else{
                const response: ResponseWithoutData = {
                    message: 'Not permited to perform action',
                    statusCode: 403,
                    success: false
                }
                return res.status(response.statusCode).json(response);
            }
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