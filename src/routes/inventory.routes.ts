import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { InventoryController } from "../controllers/inventory.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

@autoInjectable()
export class InventoryRoute implements IRoute
{
    public path: string = '/api/v1/inventories';
    public router: Router = Router();
    
    public inventoryController: InventoryController;
    public authMiddleware: AuthMiddleware;
    /**
     *
     */
    constructor(inventoryController: InventoryController,authMiddleware: AuthMiddleware) {
        this.inventoryController = inventoryController;
        this.authMiddleware = authMiddleware;
        this.InitializeRoutes();
    }

    public InitializeRoutes(): void
    {
        this.router.post(this.path, [this.authMiddleware.isUserLoggedIn, this.authMiddleware.isAdmin], this.inventoryController.createInventory);
        this.router.get(this.path, [this.authMiddleware.isUserLoggedIn], this.inventoryController.getAllInventories);
        this.router.get(`${this.path}/:id`, [this.authMiddleware.isUserLoggedIn], this.inventoryController.getSingleInventory);
        this.router.put(`${this.path}/:id`, [this.authMiddleware.isUserLoggedIn, this.authMiddleware.isAdmin], this.inventoryController.updateInventory);
        this.router.delete(`${this.path}/:id`, [this.authMiddleware.isUserLoggedIn, this.authMiddleware.isAdmin], this.inventoryController.deleteInventory);
    }


}