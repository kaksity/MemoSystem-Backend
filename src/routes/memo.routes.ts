import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { MemoController } from "../controllers/memo.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { FileUpload } from "../middlewares/fileupload.middlewares";

@autoInjectable()
export class MemoRoute implements IRoute{
    public path: string = '/api/v1/memos';
    router: Router = Router();

    public memoController: MemoController;
    public authMiddlware: AuthMiddleware;
    public fileUpload: FileUpload;
    
    /**
     *
     */
    constructor(authMiddlware: AuthMiddleware, memoController: MemoController, fileUpload: FileUpload) {
        this.memoController = memoController;
        this.authMiddlware = authMiddlware;
        this.fileUpload = fileUpload;
        this.InitializeRoutes();
    }

    public InitializeRoutes()
    {
        // Memo
        this.router.post(this.path,[this.authMiddlware.isUserLoggedIn], this.memoController.createNewMemo);
        this.router.delete(`${this.path}/:memoId`,[this.authMiddlware.isUserLoggedIn], this.memoController.deleteMemo);
        this.router.get(`${this.path}/self`,[this.authMiddlware.isUserLoggedIn], this.memoController.getAllSelfMemos);
        this.router.get(`${this.path}/mentions`,[this.authMiddlware.isUserLoggedIn], this.memoController.getAllMentionMemos);
        this.router.get(`${this.path}/:memoId`,[this.authMiddlware.isUserLoggedIn], this.memoController.getMemoDetails);
        this.router.put(`${this.path}/:memoId`,[this.authMiddlware.isUserLoggedIn], this.memoController.updateMemo);
        
        // Memo Reciepients
        this.router.get(`${this.path}/:memoId/receipients`,[this.authMiddlware.isUserLoggedIn], this.memoController.getMemoReceipients);
        
        //Memo Attachments
        this.router.post(`${this.path}/:memoId/attachments`,[this.authMiddlware.isUserLoggedIn, this.fileUpload.UploadMemo().single('file')], this.memoController.createNewMemoAttachment);
        this.router.get(`${this.path}/:memoId/attachments`,[this.authMiddlware.isUserLoggedIn], this.memoController.getAllMemoAttachments);
        this.router.delete(`${this.path}/attachments/:memoAttachmentId`,[this.authMiddlware.isUserLoggedIn], this.memoController.deleteMemoAttachment);
        
        //Memo Comments
        this.router.post(`${this.path}/:memoId/comments`,[this.authMiddlware.isUserLoggedIn], this.memoController.createNewMemoComment);
        this.router.get(`${this.path}/:memoId/comments`,[this.authMiddlware.isUserLoggedIn], this.memoController.getAllMemoComments);
        this.router.delete(`${this.path}/comments/:memoCommentId`,[this.authMiddlware.isUserLoggedIn], this.memoController.deleteComment);
        // this.router.get(`${this.path}/:memoId/recieved`,[this.authMiddlware.isUserLoggedIn], this.memoController.getMemoReceipients);
        
    }

}