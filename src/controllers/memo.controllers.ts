import { Response } from "express";
import { autoInjectable } from "tsyringe";
import { In } from "typeorm";
import { Memo } from "../entity/Memo";
import { MemoAttachment } from "../entity/MemoAttachment";
import { MemoReceipient } from "../entity/MemoReceipient";
import { User } from "../entity/User";
import { IMemo } from "../interfaces/memo.interfaces";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";
import moment from "moment";

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
}