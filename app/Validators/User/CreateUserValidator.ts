import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    fullName: schema.string([rules.required(), rules.minLength(4), rules.trim()]),
    roleId: schema.number([rules.required(), rules.uuid(), rules.trim()]),
    username: schema.string([rules.minLength(3), rules.required(), rules.trim()]),
    password: schema.string([rules.minLength(8), rules.required(), rules.trim()]),
  })
  public messages: CustomMessages = {
    'fullName.required': 'Full Name is required',
    'roleId.required': 'Role is required',
    'username.required': 'Username is required',
    'password.required': 'Password is required',
    'fullName.minLength': 'Full Name must be more than 4 Characters',
    'roleId.uuid': 'Role is not valid',
    'username.minLength': 'Username must be more than 3 characters',
    'password.minLength': 'Password must be 8 or more characters',
  }
}
