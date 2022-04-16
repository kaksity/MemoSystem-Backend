import { Router } from "express";
import { autoInjectable } from "tsyringe";
import { FileController } from "../controllers/file.controllers";
import { IRoute } from "../interfaces/route.interfaces";
import { AuthMiddleware } from "../middlewares/auth.middlewares";
import { FileUpload } from "../middlewares/fileupload.middlewares";

@autoInjectable()
export class FileRoutes implements IRoute
{
    public path: string = '/api/v1/files';
    public router: Router = Router();
    public fileController: FileController;
    public authMiddleware: AuthMiddleware;
    public fileUpload: FileUpload;
    
    /**
     *
     */
    constructor(fileController: FileController, authMiddleware: AuthMiddleware, fileUpload: FileUpload) {
        this.fileController = fileController;
        this.authMiddleware = authMiddleware;
        this.fileUpload = fileUpload;
        this.InitializeRoutes();        
    }
    public InitializeRoutes(): void {
        this.router.post(this.path,[this.authMiddleware.isUserLoggedIn],this.fileController.createNewFile);
        this.router.get(this.path,[this.authMiddleware.isUserLoggedIn], this.fileController.getAllFiles);
        this.router.get(`${this.path}/:fileId`,[this.authMiddleware.isUserLoggedIn], this.fileController.getSingleFile);
        this.router.delete(`${this.path}/:fileId`,[this.authMiddleware.isUserLoggedIn], this.fileController.deleteFile);
        this.router.post(`${this.path}/documents/`,[this.authMiddleware.isUserLoggedIn,this.fileUpload.UploadFile().single('file')], this.fileController.createNewFileDocument);
        this.router.get(`${this.path}/:fileId/documents`,[this.authMiddleware.isUserLoggedIn], this.fileController.getAllFileDocuments)
        this.router.delete(`${this.path}/documents/:fileDocumentId`,[this.authMiddleware.isUserLoggedIn], this.fileController.deleteFileDocument);
    }

}