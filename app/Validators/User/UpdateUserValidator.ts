import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    fullName: schema.string([rules.minLength(4), rules.trim()]),
    roleId: schema.string([rules.uuid(), rules.trim()]),
  })
  public messages: CustomMessages = {
    'fullName.required': 'Full Name is required',
    'roleId.required': 'Role is required',
    'fullName.minLength': 'Full Name must be more than 4 Characters',
    'roleId.uuid': 'Role is not valid',
  }
}
