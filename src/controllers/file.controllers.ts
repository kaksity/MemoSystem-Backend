import { Response } from "express";
import { autoInjectable } from "tsyringe";
import { File } from "../entity/File";
import { FileDocument } from "../entity/FileDocument";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";

@autoInjectable()
export class FileController {
    public async createNewFile(req: AuthenticatedRequest, res: Response){
        try {
            
            let {fileName, fileCode, fileDescription} = req.body;

            // Check if the file code already exist
            let result = await File.findOne({
                where: {
                    code: fileCode
                }
            });
            
            if(result){
                const response: ResponseWithoutData = {
                    message: 'File with the file code already exist',
                    success: false,
                    statusCode: 400
                }

                return res.status(response.statusCode).json(response);
            }
            
            const newFileRecord = new File();
            
            newFileRecord.userId = req.jwtPayload.userId;
            newFileRecord.name = fileName;
            newFileRecord.code = fileCode;
            newFileRecord.description = fileDescription;

            newFileRecord.save();

            const response: ResponseWithoutData = {
                message: 'File was created successfully',
                success: true,
                statusCode: 201
            }

            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async getAllFiles(req: AuthenticatedRequest, res: Response) {
        try {
            

            const files: File[] = await File.find({
                where: {
                    deletedAt: null
                }
            });
            
            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all files',
                statusCode: 200,
                data: {
                    files
                }
            }
            return res.status(response.statusCode).json(response);
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async getSingleFile(req: AuthenticatedRequest, res: Response)
    {
        try {
            
            const fileId = req.params.fileId;

            const file: File = await File.findOne({
                where: {
                    id: fileId
                }
            });
            if(!file){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'File does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }
            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived file details',
                statusCode: 200,
                data: {
                    file
                }
            }
            return res.status(response.statusCode).json(response);
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async deleteFile(req: AuthenticatedRequest, res: Response) {
        try {
            
            const fileId = req.params.fileId;

            const file: File = await File.findOne({
                where: {
                    id: fileId
                }
            });
            
            if(!file){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'File does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            file.softRemove();
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'File was deleted succcessfully',
                statusCode: 200,
            }

            return res.status(response.statusCode).json(response);
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async getAllFileDocuments(req: AuthenticatedRequest, res: Response) {
        try {
            
            const fileId = req.params.fileId;

            const fileDocuments: FileDocument[] = await FileDocument.find({
                where: {
                    fileId,
                    deletedAt: null
                }
            });
            
            fileDocuments.map(element => {
                element.url = `${process.env.URL}/public/uploads/${element.url}`;
            })
            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all file documents',
                statusCode: 200,
                data: {
                    fileDocuments
                }
            }
            return res.status(response.statusCode).json(response);
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async deleteFileDocument(req: AuthenticatedRequest, res: Response) {
        try {
            
            const fileDocumentId = req.params.fileDocumentId;

            const fileDocument: FileDocument = await FileDocument.findOne({
                where: {
                    id: fileDocumentId
                }
            });
            
            if(!fileDocument){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'File Document does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            fileDocument.softRemove();
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'File Document was deleted succcessfully',
                statusCode: 200,
            }

            return res.status(response.statusCode).json(response);
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }
    public async createNewFileDocument(req: AuthenticatedRequest, res: Response)
    {
        try {
            
            let {fileId,documentName} = req.body;

            // Check if the file code already exist
            let result = await File.findOne({
                where: {
                    id: fileId
                }
            });
            
            if(!result){
                const response: ResponseWithoutData = {
                    message: 'File does not exist',
                    success: false,
                    statusCode: 400
                }

                return res.status(response.statusCode).json(response);
            }
            
            const newFileDocument = new FileDocument();
            
            newFileDocument.fileId = fileId;
            newFileDocument.name = documentName;
            newFileDocument.url = req.file.filename;
            newFileDocument.save();

            const response: ResponseWithoutData = {
                message: 'File Document was created successfully',
                success: true,
                statusCode: 201
            }

            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                message: error.message,
                success: false,
                statusCode: 500
            }
            return res.status(response.statusCode).json(response);
        }
    }   
}