import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LoginValidator } from '../../../Validators'
import { AuthService, UserService } from '../../../Services'
import NotFoundException from '../../../Exceptions/NotFoundException'
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
    if (isPasswordValid === false) {
      throw new NotFoundException('User record does not exist')
    }

    const data = {
      success: true,
      access_token: await auth.login(user),
    }
    return response.json(data)
  }
}
