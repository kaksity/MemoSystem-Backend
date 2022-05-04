import { JwtPayload } from "jsonwebtoken";
import { User } from "../entity/User";

export interface IJwtPayload extends JwtPayload{
    user: User
} 