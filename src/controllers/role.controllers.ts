import { Response } from "express";
import { autoInjectable } from "tsyringe";
import { Role } from "../entity/Role";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";
import { IRole } from "../interfaces/role.interfaces";

@autoInjectable()
export class RoleController {
    public async createNewRole(req: AuthenticatedRequest, res: Response)
    {
        try {
            let {name, code} = req.body;
        
            const result = await Role.findOne({
                where:{
                    code
                }
            });

            if(result)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Role with this code already exist',
                    statusCode: 400
                }
                return res.status(response.statusCode).json(response);
            }
    
            const role = Role.create({
                name,
                code
            });
            
            await role.save();
            const response: ResponseWithoutData = {
                success: true,
                message: 'Role was created successfully',
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
    public async deleteRole(req: AuthenticatedRequest, res: Response)
    {
        try {
        
            const roleId: string = req.params.roleId;

            const result:Role  = await Role.findOne({
                where:{
                    id: roleId        
                }
            });
    
            if(!result)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Role does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }
    
            await result.softRemove();
            const response: ResponseWithoutData = {
                success: true,
                message: 'Role was deleted successfully',
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
    public async getAllRoles(req: AuthenticatedRequest, res: Response)
    {
        try {

            const result:Role[]  = await Role.find({
                order:{
                    name: "ASC"
                },
                where:{
                    deletedAt: null
                }
            });
    
            const data: IRole[] = [];

            result.forEach(element => {
                data.push({
                    id: element.id,
                    label: element.name
                });
            })

            const response: ResponseWithData<IRole[]> = {
                success: true,
                message: 'Retrived roles',
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
}