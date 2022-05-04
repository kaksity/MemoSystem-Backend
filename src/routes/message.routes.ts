import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { MessageController } from "../controllers/message.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

@autoInjectable()
export class MessageRoute implements IRoute {
    public path: string = '/api/v1/messages';
    public router: Router = Router();;
    
    public messageController: MessageController;
    public authMiddleware: AuthMiddleware;

    /**
     *
     */
    constructor(messageController: MessageController, authMiddleware: AuthMiddleware) {
        
        this.messageController = messageController;
        this.authMiddleware = authMiddleware;

        this.InitializeRoutes();        
    }
    public InitializeRoutes()
    {
        this.router.post(this.path,[this.authMiddleware.isUserLoggedIn], this.messageController.createNewMessage);
        this.router.get(`${this.path}/self`,[this.authMiddleware.isUserLoggedIn], this.messageController.getAllSelfMessages);
        this.router.get(`${this.path}/mentions`,[this.authMiddleware.isUserLoggedIn], this.messageController.getAllMentionMessages);
        this.router.get(`${this.path}/:messageId`,[this.authMiddleware.isUserLoggedIn], this.messageController.getMessageDetails);
        this.router.get(`${this.path}/:messageId/receipients`,[this.authMiddleware.isUserLoggedIn], this.messageController.getMessageReceipients);
        this.router.delete(`${this.path}/:messageId`,[this.authMiddleware.isUserLoggedIn], this.messageController.deleteMessage);
        
    }

}