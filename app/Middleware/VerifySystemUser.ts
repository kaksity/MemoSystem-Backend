import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import RoleService from 'App/Services/RoleService'

@inject()
export default class VerifySystemUser {
  constructor(private roleService: RoleService) {}
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user!

    const role = await this.roleService.getRoleByCode('system-user')

    if (user.roleId === role!.id) {
      throw new UnauthorizedException('Action is not permitted')
    }

    await next()
  }
}
