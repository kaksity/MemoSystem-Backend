import { Response } from "express";
import moment from "moment";
import { autoInjectable } from "tsyringe";
import { getManager } from "typeorm";
import { Message } from "../entity/Message";
import { MessageReceipient } from "../entity/MessageReceipient";
import { User } from "../entity/User";
import { IMessage } from "../interfaces/message.interfaces";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { ResponseWithData, ResponseWithoutData } from "../interfaces/response.interface";

@autoInjectable()
export class MessageController {
    public async createNewMessage(req: AuthenticatedRequest, res: Response)
    {
        try {
            const {receipients, message, title} = req.body;

            const userIds = [];

            
            receipients.forEach(element => {
                userIds.push(element.receipient);
            });

            const users = await User.findByIds(userIds);

            await getManager().transaction(async transactionalEntityManager => {
                const newMessage = await Message.create({
                    message,
                    title,
                    date: new Date(),
                    user: req.user
                });

                await transactionalEntityManager.save(newMessage);

                for (let index = 0; index < users.length; index++) {
                    const user = userIds[index];

                    const messageReceipients = MessageReceipient.create({
                        messageId: newMessage.id,
                        user
                    });
                    await transactionalEntityManager.save(messageReceipients)
                }
            });
            
            
            const response: ResponseWithoutData = {
                success: true,
                message: 'Message was sent successfully',
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
    public async getAllSelfMessages(req: AuthenticatedRequest, res: Response)
    {
        try {
            const messageQueryResult = await Message.find({
                order: {
                    date: "DESC"
                },
                where:{
                    user: req.user
                }
            });

            const messages: IMessage[] = [];
            
            for (let index = 0; index < messageQueryResult.length; index++) {
                
                const message = messageQueryResult[index];
                
                messages.push({
                    id: message.id,
                    date: moment(message.date).format('DD-MM-YYYY hh:mm:ss a'),
                    title: message.title
                });

            }


            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all self messages',
                statusCode: 200,
                data: {
                    messages
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
    public async getAllMentionMessages(req: AuthenticatedRequest, res: Response)
    {
        try {
            const messageQueryResult = await Message.createQueryBuilder("message").innerJoin("message.receipients","receipients").where("receipients.userId = :userId",{userId: req.user.id}).orderBy("message.date","DESC").getMany();

            const messages: IMessage[] = [];

            for (let index = 0; index < messageQueryResult.length; index++) {
                
                const message = messageQueryResult[index];
                
                messages.push({
                    id: message.id,
                    date: moment(message.date).format('DD-MM-YYYY hh:mm:ss a'),
                    title: message.title
                });

            }


            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all mentioned messages',
                statusCode: 200,
                data: {
                    messages
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
    public async deleteMessage(req: AuthenticatedRequest, res: Response)
    {
        try {
            const messageId: string = req.params.messageId;

            const message = await Message.findOne({
                where:{
                    id: messageId
                }
            });

            if(!message){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Message does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }
                
            await message.softRemove();

            const response: ResponseWithoutData = {
                success: true,
                message: 'Message was deleted successfully',
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
    public async getMessageDetails(req:AuthenticatedRequest, res: Response)
    {
        try {
            const messageId: string = req.params.messageId;

            const message = await Message.findOne({
                relations:[
                    'user',
                ],
                
                where:{
                    id: messageId
                }
            });

            if(!message){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Message does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived message details',
                statusCode: 200,
                data: {
                    message
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
    public async getMessageReceipients(req:AuthenticatedRequest, res: Response)
    {
        try {
            const messageId: string = req.params.messageId;

            const message = await Message.findOne({
                where:{
                    id: messageId
                }
            });

            if(!message){
                const response: ResponseWithoutData = {
                    success: false,
                    message: 'Message does not exist',
                    statusCode: 404
                }
                return res.status(response.statusCode).json(response);
            }

            const receipients = await MessageReceipient.find({
                relations: ['user'],
                where:{
                    message
                }
            });
            
            const response: ResponseWithData<any> = {
                success: true,
                message: 'Retrived all message receipients',
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
}