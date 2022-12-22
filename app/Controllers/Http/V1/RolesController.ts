import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateRoleValidator } from 'App/Validators'
import { RoleService } from '../../../Services'
import AlreadyExistException from '../../../Exceptions/AlreadyExistException'
import NotFoundException from '../../../Exceptions/NotFoundException'
import { RoleResource } from '../../../Resources/'
@inject()
export default class RolesController {
  /**
   *
   */
  constructor(private roleService: RoleService) {}
  public async index({ response }: HttpContextContract) {
    const roles = await this.roleService.getAllRoles()

    return response.json(RoleResource.collection(roles))
  }
  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateRoleValidator)

    const { name, code } = request.body()

    const role = await this.roleService.getRoleByCode(code)

    if (role) {
      throw new AlreadyExistException('Role record already exist')
    }
    await this.roleService.createRole({ name, code })

    return response.created({
      success: true,
      message: 'Role record was created successfully',
    })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const role = await this.roleService.getRoleById(params.id)
    if (role === null) {
      throw new NotFoundException('Role record does not exist')
    }

    await this.roleService.deleteRole(role)
    return response.json({
      success: true,
      message: 'Role record was deleted successfully',
    })
  }
}
