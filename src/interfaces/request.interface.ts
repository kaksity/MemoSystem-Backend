import { Request } from "express";
import { User } from "../entity/User";

export interface AuthenticatedRequest extends Request{
    user?: User,
    role?: string
}