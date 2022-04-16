import { Router } from "express";
import { autoInjectable, inject, injectable } from "tsyringe";
import { AuthController } from "../controllers/auth.controllers";
import { IRoute } from "../interfaces/route.interfaces";

@autoInjectable()
export class AuthRoutes implements IRoute{
    
    public path: string = `/api/v1/auth`;
    public router: Router = Router();
    
    public authController: AuthController;

    constructor(authController: AuthController) {
        this.authController = authController;
        this.InitializeRoutes();        
    }
    public InitializeRoutes(): void {
        this.router.post(`${this.path}/login`, this.authController.loginUser);
        // this.router.post(`${this.path}/register`,this.authController.registerUser);
    }
}