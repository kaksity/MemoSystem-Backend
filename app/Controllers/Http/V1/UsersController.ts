import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import RoleService from 'App/Services/RoleService'
import { CreateUserValidator } from 'App/Validators'
import { AlreadyExistException } from 'App/Exceptions'
import NotFoundException from 'App/Exceptions/NotFoundException'
import AuthService from 'App/Services/AuthService'
import { UserResource } from 'App/Resources'

@inject()
export default class UsersController {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService
  ) {}
  public async index({ request, response }: HttpContextContract) {
    const users = await this.userService.getAllUsers()
    return response.json(UserResource.collection(users))
  }

  public async store({ request, response }: HttpContextContract) {
    const { fullName, roleId, username, password } = request.body()

    await request.validate(CreateUserValidator)

    const user = await this.userService.getUserByUsername(username)

    if (user) {
      throw new AlreadyExistException('User record already exist')
    }

    const roleRecord = await this.roleService.getRoleById(roleId)

    if (roleRecord === null) {
      throw new NotFoundException('Role record does not exist')
    }

    const hashedPassword = await this.authService.hashPassword(password)

    await this.userService.createUser({
      username,
      passwordHash: hashedPassword,
      fullName,
      roleId,
    })

    return response.created({
      success: true,
      message: 'User record was created successfully',
    })
  }
  public async destroy({ params, response }: HttpContextContract) {
    // Check if the user exist
    const user = await this.userService.getUserById(params.id)
    if (user === null) {
      throw new NotFoundException('User record does not exist')
    }

    await this.userService.deleteUser(user)

    return response.json({
      success: true,
      message: 'User record was deleted successfully',
    })
  }
}
