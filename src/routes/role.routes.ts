import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { RoleController } from "../controllers/role.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

@autoInjectable()
export class RoleRoute implements IRoute{
    public path: string = '/api/v1/roles';
    public router: Router = Router();
    /**
     *
     */
    public roleController: RoleController;
    public authMiddleware: AuthMiddleware;

    constructor(roleController: RoleController, authMiddleware: AuthMiddleware) {
        this.roleController = roleController;
        this.authMiddleware = authMiddleware;
        this.InitializeRoutes();        
    }
    public InitializeRoutes() {
        this.router.get(`${this.path}`,[this.authMiddleware.isUserLoggedIn],this.roleController.getAllRoles);
        this.router.post(`${this.path}`,[this.authMiddleware.isUserLoggedIn],this.roleController.createNewRole);
        this.router.delete(`${this.path}/:roleId`,[this.authMiddleware.isUserLoggedIn],this.roleController.deleteRole);
    };
}