import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePasswordValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    oldPassword: schema.string([rules.minLength(8), rules.alphaNum(), rules.trim()]),
    newPassword: schema.string([rules.minLength(8), rules.alphaNum(), rules.trim()]),
    confirmPassword: schema.string([rules.minLength(8), rules.alphaNum(), rules.trim()]),
  })

  public messages: CustomMessages = {
    'oldPassword.required': 'Old Password is required',
    'newPassword.required': 'New Password is required',
    'confirmPassword.required': 'Confirm Password is required',
    'oldPassword.minLength': 'Old Password must be 8 or more characters',
    'newPassword.minLength': 'New Password must be 8 or more characters',
    'confirmPassword.minLength': 'Confirm Password must be 8 or more characters',
  }
}
