import { inject } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CreateRoleValidator } from 'App/Validators'
import { RoleService } from '../../../Services'
import AlreadyExistException from '../../../Exceptions/AlreadyExistException'
@inject()
export default class RolesController {
  /**
   *
   */
  constructor(private roleService: RoleService) {}
  public async store({ request, response }: HttpContextContract) {
    const { name, code } = request.body()

    await request.validate(CreateRoleValidator)

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
}
