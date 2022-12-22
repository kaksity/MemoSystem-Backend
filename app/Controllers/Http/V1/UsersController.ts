// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/core/build/standalone';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { UserService, RoleService } from '../../../Services';
import { CreateUserValidator } from '../../../Validators';
import { AlreadyExistException } from '../../../Exceptions';
import NotFoundException from '../../../Exceptions/NotFoundException';
import { AuthService } from '../../../Services/AuthService';

@inject()
export default class UsersController {

    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private authService: AuthService
    ) {
    }
    public async index({ request, response }: HttpContextContract) {

    }

    public async show({ request, response }: HttpContextContract) {
        
    }
    
    public async store({ request, response }: HttpContextContract) {
        const { fullName, role, username, password } = request.body()

        await request.validate(CreateUserValidator)

        const user = await this.userService.getUserByUsername(username)

        if (user) {
            throw new AlreadyExistException('User record already exist')
        }

        const roleRecord = await this.roleService.getRoleById(role)

        if (roleRecord == null) {
            throw new NotFoundException('Role record does not exist')
        }

        const hashPassword = await this.authService.hashPassword(password)

        
    }
    public async destroy({ request, response }: HttpContextContract) {

    }
}
