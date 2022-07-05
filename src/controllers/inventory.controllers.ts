import { Response } from "express";
import { autoInjectable } from "tsyringe";
import { Inventory } from "../entity/Inventory";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";

@autoInjectable()
export class InventoryController 
{
    public async createInventory(req: AuthenticatedRequest, res: Response)
    {
        try
        {
            const { article, quantity, code} = req.body;
            
            // Check if an inventory with this code already exist

            const inventory = await Inventory.findOne({
                where:{
                    code
                }
            });

            if(inventory != null)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Inventory with code already exist',
                    statusCode: 400
                }
                return res.status(response.statusCode).json(response);
            }

            await Inventory.insert({
                article,
                quantity,
                code
            });

            const response: ResponseWithoutData = {
                statusCode: 201,
                success: true,
                message: 'Inventory was created successfully'
            }

            return res.status(response.statusCode).json(response);

        } 
        catch(error)
        {
            const response: ResponseWithoutData = {
                message: error.message,
                statusCode: 500,
                success: false,
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async getAllInventories(req: AuthenticatedRequest, res: Response)
    {
        try
        {
            const inventories: Inventory[] = await Inventory.find();

            const response: ResponseWithData<any> = {
                statusCode: 200,
                message: 'Retrieved Inventories',
                data: inventories,
                success: true
            }

            return res.status(response.statusCode).json(response);
        }
        catch(error)
        {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async getSingleInventory(req: AuthenticatedRequest, res: Response)
    {
        try
        {
            const inventory = await Inventory.findOne({
                where:{
                    id: req.params.id
                }
            });

            if(inventory == null)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Inventory does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }


            const response: ResponseWithData<any> = {
                statusCode: 200,
                success: true,
                message: 'Retrived inventory details',
                data: inventory
            }

            return res.status(response.statusCode).json(response);
        }
        catch(error)
        {
            const response: ResponseWithoutData = {
                message: error.message,
                statusCode: 500,
                success: false
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async updateInventory(req: AuthenticatedRequest, res: Response)
    {
        try
        {
            const { article, quantity } = req.body;

            const inventory = await Inventory.findOne({
                where:{
                    id: req.params.id
                }
            });

            if(inventory == null)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Inventory does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            inventory.article = article;
            inventory.quantity = quantity;

            await inventory.save();

            const response: ResponseWithoutData = {
                statusCode: 200,
                success: true,
                message: 'Inventory was updated successfully'
            }

            return res.status(response.statusCode).json(response);
        }
        catch(error)
        {
            const response: ResponseWithoutData = {
                message: error.message,
                statusCode: 500,
                success: false
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async deleteInventory(req: AuthenticatedRequest, res: Response)
    {
        try
        {
            // Check if an inventory already exist

            const inventory = await Inventory.findOne({
                where:{
                    id: req.params.id
                }
            });

            if(inventory == null)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Inventory does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            await inventory.softRemove();

            const response: ResponseWithoutData = {
                statusCode: 200,
                success: true,
                message: 'Inventory was deleted successfully'
            }

            return res.status(response.statusCode).json(response);
        }
        catch(error)
        {
            const response: ResponseWithoutData = {
                message: error.message,
                statusCode: 500,
                success: false,
            }

            return res.status(response.statusCode).json(response);
        }
    }
}