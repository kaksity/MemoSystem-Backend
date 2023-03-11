import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UploadDocumentValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    file: schema.file({
      size: '10mb',
    }),
    name: schema.string([rules.minLength(3), rules.maxLength(200)]),
  })

  public messages: CustomMessages = {
    'file.required': 'File Document is required',
    'name.required': 'File Document Name is required',
    'file.size': 'File Document must be less than 10mb',
    'name.minLength': 'File Document Name must be at least 3 characters long',
    'name.maxLength': 'File Document Name must not be greater than 200 characters',
  }
}
