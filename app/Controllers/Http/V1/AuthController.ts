import { inject } from '@adonisjs/core/build/standalone'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import RegistrationValidator from 'App/Validators/Auth/RegistrationValidator'
import AuthService from 'App/Services/AuthService'
import UserService from 'App/Services/UserService'
import NotFoundException from 'App/Exceptions/NotFoundException'
import AlreadyExistException from 'App/Exceptions/AlreadyExistException'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import ChangePasswordValidator from 'App/Validators/Auth/ChangePasswordValidator'
import UserResource from 'App/Resources/User/UserResource'
@inject()
export default class AuthController {
  /**
   * Inject the Authentication Service and User Service
   */
  constructor(private authService: AuthService, private userService: UserService) {}
  public async login({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.body()

    await request.validate(LoginValidator)

    // Check if the user exist
    const user = await this.userService.getUserByUsername(username)
    if (user === null) {
      throw new NotFoundException('User record does not exist')
    }
    const isPasswordValid = await this.authService.verifyPassword({
      password,
      passwordHash: user.password,
    })
    // if (isPasswordValid === false) {
    //   throw new NotFoundException('User record does not exist')
    // }

    const data = {
      success: true,
      user: UserResource.single(user),
      access_token: await auth.login(user),
    }
    return response.json(data)
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.body()
    await request.validate(RegistrationValidator)

    let user = await this.userService.getUserByUsername(username)

    if (user) {
      throw new AlreadyExistException('User record already exists')
    }
    const passwordHash = await this.authService.hashPassword(password)

    user = await this.userService.createUser({
      username,
      passwordHash,
      fullName: 'Admin',
      roleId: '',
    })

    return response.created({
      success: true,
      user: UserResource.single(user),
      access_token: await auth.login(user),
    })
  }
  public async changePassword({ request, response, auth }: HttpContextContract) {
    await request.validate(ChangePasswordValidator)
    const { oldPassword, newPassword } = request.body()

    const user = auth.user!

    if (
      (await this.authService.verifyPassword({
        password: oldPassword,
        passwordHash: user.password,
      })) === false
    ) {
      throw new BadRequestException('Old Password is not correct')
    }
    user.password = await this.authService.hashPassword(newPassword)

    await this.userService.updateUser(user)
    return response.json({
      success: true,
      message: 'Password was changed successfully',
    })
  }
}
