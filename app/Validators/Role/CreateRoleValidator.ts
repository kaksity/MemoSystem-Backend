import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateRoleValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    name: schema.string([rules.required(), rules.minLength(4), rules.trim()]),
    code: schema.string([rules.required(), rules.minLength(4), rules.trim()]),
  })
  public messages: CustomMessages = {
    'name.required': 'Role Name is required',
    'code.required': 'Role Code is required',
  }
}
