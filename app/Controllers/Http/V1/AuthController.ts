import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LoginValidator, RegistrationValidator } from '../../../Validators'
import { AuthService, UserService } from '../../../Services'
import { NotFoundException, AlreadyExistException } from '../../../Exceptions'
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
      roleId: 1,
    })

    return response.created({
      success: true,
      access_token: await auth.login(user),
    })
  }
}
