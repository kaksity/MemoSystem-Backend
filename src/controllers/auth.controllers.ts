import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { createQueryBuilder } from "typeorm";
import { v4 } from "uuid";
import { Role } from "../entity/Role";
import { User } from "../entity/User";
import { AuthenticatedRequest } from "../interfaces/request.interface";
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

            const result: User = await User.findOne({
                where:{
                    username
                }
            });
            //const result = await createQueryBuilder().from(User,"user").innerJoinAndSelect("user.role","role").where('username = :username',{username}).getOne()
            
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

            const roleResult: Role = await Role.findOne({
                where:{
                    id: result.roleId
                }
            })

            const response: ResponseWithData<any> = {
                success: true,
                message: 'Login successfully',
                data : {
                    token: signJwtToken({userId: result.id,role: roleResult.code},process.env.JWT_SECRET_KEY),
                    expires: 60 * 60,
                    user: {
                        fullName: result.fullName,
                        roleCode: roleResult.code
                    }
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
    public async registerUser(req: Request, res:Response)
    {

        try {
            
            let { username, password } = req.body;

            const result: User = await User.findOne({
                where:{
                    username
                }
            });
            
            if(result) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'User already exist',
                    statusCode: 400
                }
        
                return res.status(response.statusCode).json(response);
            }
            
            const hashedPassword = await hash(password, 10);
            
            const newUserRecord = new User();
            

            newUserRecord.username = username;
            newUserRecord.password = hashedPassword;
            newUserRecord.roleId = v4();
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'Registered successfully',
                statusCode: 201
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