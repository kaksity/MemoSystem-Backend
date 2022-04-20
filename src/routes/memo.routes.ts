import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { MemoController } from "../controllers/memo.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";

@autoInjectable()
export class MemoRoute implements IRoute{
    public path: string = '/api/v1/memos';
    router: Router = Router();

    public memoController: MemoController;
    public authMiddlware: AuthMiddleware;

    /**
     *
     */
    constructor(authMiddlware: AuthMiddleware, memoController: MemoController) {
        this.memoController = memoController;
        this.authMiddlware = authMiddlware;

        this.InitializeRoutes();
    }

    public InitializeRoutes()
    {
        this.router.post(this.path,[this.authMiddlware.isUserLoggedIn], this.memoController.createNewMemo);
        this.router.delete(`${this.path}/:memoId`,[this.authMiddlware.isUserLoggedIn], this.memoController.deleteMemo);
        this.router.get(`${this.path}/self`,[this.authMiddlware.isUserLoggedIn], this.memoController.getAllSelfMemos);
        this.router.get(`${this.path}/mentions`,[this.authMiddlware.isUserLoggedIn], this.memoController.getAllMentionMemos);
        this.router.get(`${this.path}/:memoId`,[this.authMiddlware.isUserLoggedIn], this.memoController.getMemoDetails);
        this.router.get(`${this.path}/:memoId/receipients`,[this.authMiddlware.isUserLoggedIn], this.memoController.getMemoReceipients);
        // this.router.get(`${this.path}/:memoId/recieved`,[this.authMiddlware.isUserLoggedIn], this.memoController.getMemoReceipients);
        this.router.put(`${this.path}/:memoId`,[this.authMiddlware.isUserLoggedIn], this.memoController.updateMemo);
    }

}