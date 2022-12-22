import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    username: schema.string([rules.minLength(3), rules.trim()]),
    password: schema.string([rules.minLength(8), rules.alphaNum(), rules.trim()]),
  })

  public messages: CustomMessages = {
    'username.required': 'Username is required',
    'username.minLength': 'Username must be 3 or more characters',
    'password.required': 'Password is required',
    'password.minLength': 'Password must be 8 or more characters',
  }
}
