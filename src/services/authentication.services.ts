import { User } from "../entity/User";
import { getRepository } from "typeorm";
import { compare } from "bcryptjs";
import { injectable } from "tsyringe";


export interface IAuthenticationService
{
    login: (username: string, password: string) => Promise<User> 
}
@injectable()
export class AuthenticationService implements IAuthenticationService{
    public userRepository = null;
    constructor() {
        this.userRepository = getRepository(User);
    }
    public async login(username: string, password: string): Promise<User>{
        try {
            const user: User = this.userRepository.find({
                where:{
                    username
                }
            });

            if(!user){
                return Promise.reject(new Error('User does not exist in our records'));
            }

            const isUserCredentialsValid: boolean = await compare(password, user.password);
            
            if(isUserCredentialsValid == false){
                return Promise.reject(new Error('Invalid login credentials'));
            }

            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}