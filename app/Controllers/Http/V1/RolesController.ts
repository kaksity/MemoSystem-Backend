import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateRoleValidator from 'App/Validators/Role/CreateRoleValidator'
import RoleService from 'App/Services/RoleService'
import AlreadyExistException from 'App/Exceptions/AlreadyExistException'
import NotFoundException from 'App/Exceptions/NotFoundException'
import RoleResource from 'App/Resources/Role/RoleResource'
import {
  ROLE_ALREADY_EXIST,
  ROLE_CREATED_SUCCESSFULLY,
  ROLE_DELETED_SUCCESSFULLY,
  ROLE_DOES_NOT_EXIST,
  ROLE_LIST_RETRIEVED_SUCCESSFULLY,
} from 'App/Helpers/GeneralPurpose/CustomMessages/RoleCustomMessages'
import RoleObjectInterface from 'App/TypeChecking/ModelManagement/RoleObjectInterface'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
@inject()
export default class RolesController {
  /**
   *
   */
  constructor(private roleService: RoleService) {}

  public async index({ response }: HttpContextContract) {
    const roles = await this.roleService.getAllRoles()

    return response.json({
      success: true,
      status_code: 200,
      message: ROLE_LIST_RETRIEVED_SUCCESSFULLY,
      data: RoleResource.collection(roles),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateRoleValidator)

    const { name, code } = request.body()

    let role = await this.roleService.getRoleByCode(code)

    if (role) {
      throw new AlreadyExistException(ROLE_ALREADY_EXIST)
    }

    const createRoleOptions: Partial<RoleObjectInterface> = {
      name,
      code,
    }

    role = await this.roleService.createRoleRecord(createRoleOptions)

    return response.created({
      success: true,
      status_code: 201,
      message: ROLE_CREATED_SUCCESSFULLY,
      data: RoleResource.single(role),
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const role = await this.roleService.getRoleById(params.id)
    if (role === null) {
      throw new NotFoundException(ROLE_DOES_NOT_EXIST)
    }

    const deleteRoleRecordPayloadOptions: DeleteRecordPayloadOptions = {
      entityId: role.id,
      transaction: undefined,
    }

    await this.roleService.deleteRoleRecord(deleteRoleRecordPayloadOptions)

    return response.json({
      success: true,
      status_code: 200,
      message: ROLE_DELETED_SUCCESSFULLY,
      data: null,
    })
  }
}
