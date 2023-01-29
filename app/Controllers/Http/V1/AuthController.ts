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
import {
  USER_ALREADY_EXIST,
  USER_DELETED_SUCCESSFULLY,
  USER_DETAIL_RETRIEVED_SUCCESSFULLY,
  USER_DOES_NOT_EXIST,
  USER_UPDATED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/UserCustomMessages'
import UserObjectInterface from 'App/TypeChecking/ModelManagement/UserObjectInterface'
import UpdateRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/UpdateRecordPayloadOptions'
import RoleService from 'App/Services/RoleService'
@inject()
export default class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  public async login({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.body()

    await request.validate(LoginValidator)

    // Check if the user exist
    const user = await this.userService.getUserByUsername(username)

    if (user === null) {
      throw new NotFoundException(USER_DOES_NOT_EXIST)
    }

    const isPasswordValid = await this.authService.verifyPassword({
      password,
      passwordHash: user.password,
    })

    if (isPasswordValid === false) {
      throw new NotFoundException(USER_DOES_NOT_EXIST)
    }

    return response.json({
      success: true,
      status_code: 201,
      message: USER_DETAIL_RETRIEVED_SUCCESSFULLY,
      data: {
        user: UserResource.single(user),
        access_token: await auth.login(user),
      },
    })
  }

  public async register({ request, response, auth }: HttpContextContract) {
    const { fullName, username, password } = request.body()
    await request.validate(RegistrationValidator)

    let user = await this.userService.getUserByUsername(username)

    if (user) {
      throw new AlreadyExistException(USER_ALREADY_EXIST)
    }

    const adminRole = await this.roleService.getRoleAsSystemAdmin()

    const passwordHash = await this.authService.hashPassword(password)

    const createUserOptions: Partial<UserObjectInterface> = {
      username,
      password: passwordHash,
      fullName,
      roleId: adminRole!.id,
    }

    user = await this.userService.createUserRecord(createUserOptions)

    return response.created({
      success: true,
      status_code: 201,
      message: USER_DELETED_SUCCESSFULLY,
      data: {
        user: UserResource.single(user),
        access_token: await auth.login(user),
      },
    })
  }
  public async changePassword({ request, response, auth }: HttpContextContract) {
    await request.validate(ChangePasswordValidator)

    const { oldPassword, newPassword } = request.body()

    const user = auth.user!

    const isPasswordCorrect = await this.authService.verifyPassword({
      password: oldPassword,
      passwordHash: user.password,
    })

    if (isPasswordCorrect === false) {
      throw new BadRequestException('Old Password is not correct')
    }

    const passwordHash = await this.authService.hashPassword(newPassword)

    const updateUserRecordPayloadOptions: UpdateRecordPayloadOptions = {
      entityId: user.id,
      transaction: undefined,
      modifiedData: {
        password: passwordHash,
      },
    }

    await this.userService.updateUserRecord(updateUserRecordPayloadOptions)

    return response.json({
      success: true,
      status_code: 200,
      message: USER_UPDATED_SUCCESSFULLY,
      data: null,
    })
  }
}
