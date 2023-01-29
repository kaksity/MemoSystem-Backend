import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'
import RoleService from 'App/Services/RoleService'
import CreateUserValidator from 'App/Validators/User/CreateUserValidator'
import AlreadyExistException from 'App/Exceptions/AlreadyExistException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import AuthService from 'App/Services/AuthService'
import UserResource from 'App/Resources/User/UserResource'
import {
  USER_ALREADY_EXIST,
  USER_CREATED_SUCCESSFULLY,
  USER_DELETED_SUCCESSFULLY,
  USER_DOES_NOT_EXIST,
  USER_LIST_RETRIEVED_SUCCESSFULLY,
  USER_UPDATED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/UserCustomMessages'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import UserObjectInterface from 'App/TypeChecking/ModelManagement/UserObjectInterface'
import { ROLE_DOES_NOT_EXIST } from 'App/Helpers/GeneralPurpose/CustomMessages/RoleCustomMessages'
import UpdateUserValidator from 'App/Validators/User/UpdateUserValidator'
import UpdateRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/UpdateRecordPayloadOptions'

@inject()
export default class UsersController {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private authService: AuthService
  ) {}

  public async index({ response }: HttpContextContract) {
    const users = await this.userService.getAllUsers()
    return response.json({
      success: true,
      message: USER_LIST_RETRIEVED_SUCCESSFULLY,
      status_code: 200,
      data: UserResource.collection(users),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    const { fullName, roleId, username, password } = request.body()

    await request.validate(CreateUserValidator)

    let user = await this.userService.getUserByUsername(username)

    if (user) {
      throw new AlreadyExistException(USER_ALREADY_EXIST)
    }

    const roleRecord = await this.roleService.getRoleById(roleId)

    if (roleRecord === null) {
      throw new NotFoundException(ROLE_DOES_NOT_EXIST)
    }

    const hashedPassword = await this.authService.hashPassword(password)

    const userCreateOptions: Partial<UserObjectInterface> = {
      fullName,
      roleId,
      username,
      password: hashedPassword,
    }

    user = await this.userService.createUserRecord(userCreateOptions)

    await user.load('role')

    return response.created({
      success: true,
      message: USER_CREATED_SUCCESSFULLY,
      status_code: 201,
      data: UserResource.single(user),
    })
  }

  public async update({ request, response, params }: HttpContextContract) {
    const user = await this.userService.getUserById(params.id)

    if (user === null) {
      throw new NotFoundException(USER_DOES_NOT_EXIST)
    }

    await request.validate(UpdateUserValidator)

    const { fullName, roleId } = request.body()

    const updateUserRecordPayloadOptions: UpdateRecordPayloadOptions = {
      entityId: user.id,
      modifiedData: {
        fullName,
        roleId,
      },
      transaction: undefined,
    }

    await this.userService.updateUserRecord(updateUserRecordPayloadOptions)

    return response.json({
      success: true,
      message: USER_UPDATED_SUCCESSFULLY,
      status_code: 200,
      data: null,
    })
  }
  public async destroy({ params, response }: HttpContextContract) {
    const user = await this.userService.getUserById(params.id)
    if (user === null) {
      throw new NotFoundException(USER_DOES_NOT_EXIST)
    }

    const deleteUserRecordPayloadOptions: DeleteRecordPayloadOptions = {
      entityId: user.id,
      transaction: undefined,
    }

    await this.userService.deleteUserRecord(deleteUserRecordPayloadOptions)

    return response.json({
      success: true,
      message: USER_DELETED_SUCCESSFULLY,
      status_code: 200,
      data: null,
    })
  }
}
