import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { UserController } from "../controllers/user.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

@autoInjectable()
export class UserRoute implements IRoute {
    public path: string = '/api/v1/users';
    public router: Router = Router();
    
    /**
     *
     */
    public userController: UserController;
    public authMiddleware: AuthMiddleware;

    constructor(userController: UserController, authMiddleware: AuthMiddleware) {
        this.userController = userController;
        this.authMiddleware = authMiddleware;

        this.InitializeRoutes();
    }
    
    public InitializeRoutes()
    {
        this.router.post(this.path,[this.authMiddleware.isUserLoggedIn], this.userController.createNewUser);
        this.router.delete(`${this.path}/:userId`,[this.authMiddleware.isUserLoggedIn], this.userController.deleteUser);
        this.router.get(`${this.path}/:userId`,[this.authMiddleware.isUserLoggedIn],this.userController.getSingleUser);
        this.router.get(this.path,[this.authMiddleware.isUserLoggedIn], this.userController.getAllUsers);
        
    }

}