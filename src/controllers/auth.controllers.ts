import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";
import { signJwtToken } from "../shared/functions";

@autoInjectable()
export class AuthController {
    
    constructor() {
        
    }
    public async loginUser(req: Request, res:Response)
    {

        try {
            
            let { username, password } = req.body;
            const userRepository = getRepository(User);

            const result: User = await userRepository.findOne({
                where:{
                    username
                }
            });
            
            if(!result) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'User does not exist',
                    statusCode: 404
                }
        
                return res.status(response.statusCode).json(response);
            }
            
            const isUserCredentialsValid = await compare(password,result.password);

            if(isUserCredentialsValid == false) {

                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Invalid login credentials',
                    statusCode: 400
                }
        
                return res.status(response.statusCode).json(response);
            }

            const response: ResponseWithData<any> = {
                success: true,
                message: 'Login successfully',
                data : {
                    token: signJwtToken({userId: result.id, roleId: result.roleId},process.env.JWT_SECRET_KEY),
                    expires: 60 * 60
                },
                statusCode: 200
            }
    
            return res.status(response.statusCode).json(response);

        } catch (error) {
            
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
}