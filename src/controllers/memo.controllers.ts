import { Response } from "express";
import { autoInjectable } from "tsyringe";
import { In } from "typeorm";
import { Memo } from "../entity/Memo";
import { MemoAttachment } from "../entity/MemoAttachment";
import { MemoReceipient } from "../entity/MemoReceipient";
import { User } from "../entity/User";
import { IMemo, IMemoAttachment, IMemoComment } from "../interfaces/memo.interfaces";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";
import moment from "moment";
import { MemoComment } from "../entity/MemoComment";

@autoInjectable()
export class MemoController {
    public async createNewMemo(req: AuthenticatedRequest, res: Response)
    {
        
        try {
            const {receipients, date, content, title} = req.body;

            const userIds = [];

            
            receipients.forEach(element => {
                userIds.push(element.receipient);
            });

            const users = await User.findByIds(userIds);

            
            
            const memo = Memo.create({
                date,
                user: req.user,
                content,
                title
            });

            await memo.save();

            for (let index = 0; index < users.length; index++) {
                const user = userIds[index];

                const memoReceipients = MemoReceipient.create({
                    memoId: memo.id,
                    user
                });
                await memoReceipients.save();
            }
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'Memo was created successfully',
                statusCode: 201
            }

            return res.status(response.statusCode).json(response);

        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async updateMemo(req: AuthenticatedRequest, res: Response)
    {
        
        try {

            const memoId = req.params.memoId;
            
            const queryMemoResult = await Memo.findOne({
                relations: ['receipients'],
                where:{
                    id: memoId
                }
            });

            if (!queryMemoResult) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Memo does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            const {receipients, date, content, title} = req.body;

            


            queryMemoResult.date = date;
            queryMemoResult.content = content;
            queryMemoResult.title = title;

            const userIds = [];

            
            receipients.forEach(element => {
                userIds.push(element.receipient);
            });

            await queryMemoResult.save();

            const users = await User.findByIds(userIds);
            
            // await Memo.createQueryBuilder()
            //         .delete()
            //         .from(MemoReceipient)
            //         .where("memoId = :memoId",{memoId})
            //         .execute();
            
            const memoReceipients: MemoReceipient[] = queryMemoResult.receipients;

            for (let index = 0; index < memoReceipients.length; index++) {
                const receipient = memoReceipients[index];

                if (users.indexOf(receipient.user) == -1) {
                    receipient.softRemove();
                }
            }
            for (let index = 0; index < users.length; index++) {
                const user = userIds[index];
                if (memoReceipients.indexOf(user) == -1) {
                    const receipient = MemoReceipient.create({
                        memoId,
                        user
                    });
                    await receipient.save();
                }
            }
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'Memo was updated successfully',
                statusCode: 201
            }

            return res.status(response.statusCode).json(response);

        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async getMemoDetails(req:AuthenticatedRequest, res: Response)
    {
        try {
            const memoId: string = req.params.memoId;

            const memo = await Memo.findOne({
                relations:[
                    'user',
                ],
                
                where:{
                    id: memoId
                }
            });

            if(!memo){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Memo does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived memo details',
                statusCode: 200,
                data: {
                    memo
                }
            }
            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async getMemoReceipients(req:AuthenticatedRequest, res: Response)
    {
        try {
            const memoId: string = req.params.memoId;

            const memo = await Memo.findOne({
                where:{
                    id: memoId
                }
            });

            if(!memo){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Memo does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            const receipients = await MemoReceipient.find({
                relations: ['user'],
                where:{
                    memo: memo
                }
            });
            
            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all memo receipients',
                statusCode: 200,
                data: {
                    receipients
                }
            }
            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async deleteMemo(req: AuthenticatedRequest, res: Response)
    {
        try {
            const memoId: string = req.params.memoId;

            const memo = await Memo.findOne({
                where:{
                    id: memoId
                }
            });

            if(!memo){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Memo does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }
                
            await memo.softRemove();

            const response: ResponseWithoutData = {
                success: true,
                message: 'Memo was deleted successfully',
                statusCode: 200
            }
            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }       
    }
    public async getAllSelfMemos(req: AuthenticatedRequest, res: Response)
    {
        try {
            const memoQueryResult = await Memo.find({
                order: {
                    date: "DESC"
                },
                where:{
                    user: req.user
                }
            });

            const memos: IMemo[] = [];
            
            for (let index = 0; index < memoQueryResult.length; index++) {
                
                const memo = memoQueryResult[index];
                
                memos.push({
                    id: memo.id,
                    date: moment(memo.date).format('DD-MM-YYYY hh:mm:ss a'),
                    title: memo.title
                });

            }


            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all self memos',
                statusCode: 200,
                data: {
                    memos
                }
            }
            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async getAllMentionMemos(req: AuthenticatedRequest, res: Response)
    {
        try {
            const memoQueryResult = await Memo.createQueryBuilder("memo").innerJoin("memo.receipients","receipients").where("receipients.userId = :userId",{userId: req.user.id}).orderBy("memo.date","DESC").getMany();

            const memos: IMemo[] = [];

            for (let index = 0; index < memoQueryResult.length; index++) {
                
                const memo = memoQueryResult[index];
                
                memos.push({
                    id: memo.id,
                    date: moment(memo.date).format('DD-MM-YYYY hh:mm:ss a'),
                    title: memo.title
                });

            }


            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all mentioned memos',
                statusCode: 200,
                data: {
                    memos
                }
            }
            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async createNewMemoComment(req: AuthenticatedRequest, res: Response)
    {
        try {

            const memoId = req.params.memoId;
            
            const queryMemoResult = await Memo.findOne({
                relations: ['receipients'],
                where:{
                    id: memoId
                }
            });

            if (!queryMemoResult) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Memo does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            const {receipients, comment} = req.body;


            const userIds = [];

            
            receipients.forEach(element => {
                userIds.push(element.receipient);
            });

            const users = await User.findByIds(userIds);
            

            const memoReceipients: MemoReceipient[] = queryMemoResult.receipients;

            await MemoComment.insert({
                memo: queryMemoResult,
                user: req.user,
                message: comment
            });

            for (let index = 0; index < memoReceipients.length; index++) {
                const receipient = memoReceipients[index];

                if (users.indexOf(receipient.user) == -1) {
                    receipient.softRemove();
                }
            }

            for (let index = 0; index < users.length; index++) {
                const user = userIds[index];
                if (memoReceipients.indexOf(user) == -1) {
                    const receipient = MemoReceipient.create({
                        memoId,
                        user
                    });
                    await receipient.save();
                }
            }
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'Memo was commented successfully',
                statusCode: 201
            }

            return res.status(response.statusCode).json(response);

        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    }
    public async getAllMemoComments(req: AuthenticatedRequest, res: Response)
    {
        try {
            const memoId = req.params.memoId;
            
            const memoCommentQueryResult = await MemoComment.find({
                order: {
                    createdAt: "DESC"
                },
                relations: ['user'],
                where:{
                    id: memoId
                }
            });

            const memoComments: IMemoComment[] = [];
            
            for (let index = 0; index < memoCommentQueryResult.length; index++) {
                
                const comment = memoCommentQueryResult[index];
                
                memoComments.push({
                    id: comment.id,
                    date: moment(comment.createdAt).format('DD-MM-YYYY hh:mm:ss a'),
                    message: comment.message,
                    commentBy: comment.user.fullName
                });

            }


            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all memo comments',
                statusCode: 200,
                data: {
                    memoComments
                }
            }
            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }
    } 
    public async deleteComment(req: AuthenticatedRequest, res:Response)
    {
        try {
            const memoCommentId = req.params.memoCommentId;

            const memoComment = await MemoComment.findOne({
                relations: ['user'],
                where:{
                    id: memoCommentId,
                }
            });

            if (!memoComment) {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Memo Comment does not exist',
                    statusCode: 404,
                }

                return res.status(response.statusCode).json(response);
            }
            if (memoComment.user.id !== req.user.id)
            {
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'You can only delete comment created by you',
                    statusCode: 400,
                }

                return res.status(response.statusCode).json(response);
            }

            await memoComment.softRemove();

            const response: ResponseWithoutData = {
                success: true,
                message: 'Memo Comment was deleted successfully',
                statusCode: 200,
            }

            return res.status(response.statusCode).json(response);
            
        } catch (error) {
            const response: ResponseWithoutData = {
                success: false,
                message: error.message,
                statusCode: 500
            }

            return res.status(response.statusCode).json(response);
        }       
    }
    public async createNewMemoAttachment(req: AuthenticatedRequest, res:Response)
    {
        try {
            
            let memoId = req.params.memoId;

            // Check if the file code already exist
            let result = await Memo.findOne({
                where: {
                    id: memoId
                }
            });
            
            if(!result){
                const response: ResponseWithoutData = {
                    message: 'Memo does not exist',
                    success: false,
                    statusCode: 400
                }

                return res.status(response.statusCode).json(response);
            }
            
            const newMemoFile = new MemoAttachment();
            
            newMemoFile.memoId = memoId;
            newMemoFile.url = req.file.filename;
            newMemoFile.save();

            const response: ResponseWithoutData = {
                message: 'Memo File was attached successfully',
                success: true,
                statusCode: 201,
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
    public async getAllMemoAttachments(req: AuthenticatedRequest, res:Response)
    {
        try {
            
            let memoId = req.params.memoId;

            // Check if the file code already exist
            let result = await MemoAttachment.find({
                where: {
                    memoId: memoId
                }
            });
            
            const memoAttachments: IMemoAttachment[] = [];

            for (let index = 0; index < result.length; index++) {
                const attachment = result[index];
                memoAttachments.push({
                    id: attachment.id,
                    url: `${process.env.URL}/public/uploads/memos/${attachment.url}`
                })
            }
            const response: ResponseWithData<any> = {
                message: 'Retrived Memo Attachments',
                success: true,
                statusCode: 200,
                data:{
                    attachments: memoAttachments
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
    public async deleteMemoAttachment(req: AuthenticatedRequest, res:Response)
    {
        try {
            
            const memoAttachmentId = req.params.memoAttachmentId;

            // Check if the file code already exist
            let result = await MemoAttachment.findOne({
                where: {
                    id: memoAttachmentId
                }
            });
            
            if(!result){
                const response: ResponseWithoutData = {
                    message: 'Memo File does not exist',
                    success: false,
                    statusCode: 400
                }

                return res.status(response.statusCode).json(response);
            }
            
            
            await result.softRemove()

            const response: ResponseWithoutData = {
                message: 'Memo File was deleted successfully',
                success: true,
                statusCode: 201,
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