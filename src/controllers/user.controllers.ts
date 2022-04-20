import { hash } from "bcryptjs";
import { Response } from "express";
import { autoInjectable } from "tsyringe";
import { Role } from "../entity/Role";
import { User } from "../entity/User";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";

@autoInjectable()
export class UserController {
    public async createNewUser(req:AuthenticatedRequest, res:Response)
    {
        try
        {
            let { fullName, role, username, password } = req.body;

            const userResult: User = await User.findOne({
                where:{
                    username
                }
            });
            
            if(userResult) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'User already exist',
                    statusCode: 400
                }
        
                return res.status(response.statusCode).json(response);
            }
            
            const roleResult: Role = await Role.findOne({
                where:{
                    id: role
                }
            });

            if(!roleResult){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Role is not valid',
                    statusCode: 400
                }
        
                return res.status(response.statusCode).json(response);
            }
            const hashedPassword = await hash(password, 10);
            
            const newUserRecord = User.create({
                fullName,
                username,
                password: hashedPassword,
                roleId: role
            });
            
            newUserRecord.save();
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'User was created successfully successfully',
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
    public async getSingleUser(req:AuthenticatedRequest, res: Response)
    {
        try
        {
            let userId: string = req.params.userId;

            const userResult: User = await User.findOne({
                where:{
                    id:userId
                }
            });
            
            if(!userResult) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'User does not exist',
                    statusCode: 404
                }
        
                return res.status(response.statusCode).json(response);
            }
            
            const response: ResponseWithData<IUser> = {
                success: true,
                message: 'Retrieved user record',
                statusCode: 200,
                data: {
                    id: userResult.id,
                    fullName: userResult.fullName,
                    username: userResult.username
                }
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
    public async getAllUsers(req:AuthenticatedRequest, res: Response)
    {
        try
        {

            const userResult: User[] = await User.find({
                relations:['role'],
                order: {
                    fullName: 'ASC'
                },
                where:{
                    deletedAt: null,
                }
            });
            
            const data: IUser[] = [];

            userResult.forEach(element => {
                data.push({
                    id: element.id,
                    username: element.username,
                    fullName: element.fullName,
                    roleName: element.role.name,
                })
            });

            const response: ResponseWithData<IUser[]> = {
                success: true,
                message: 'Retrieved user record',
                statusCode: 200,
                data
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
    public async deleteUser(req:AuthenticatedRequest, res: Response)
    {
        try
        {
            let userId: string = req.params.userId;

            const userResult: User = await User.findOne({
                where:{
                    id:userId
                }
            });
            
            if(!userResult) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'User does not exist',
                    statusCode: 404
                }
        
                return res.status(response.statusCode).json(response);
            }
            
            await userResult.softRemove();

            const response: ResponseWithoutData = {
                success: true,
                message: 'User was deleted successfully',
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