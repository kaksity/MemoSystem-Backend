import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateMessageValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    recipients: schema.array([rules.minLength(1)]).members(schema.string([rules.uuid()])),
    title: schema.string([rules.minLength(4), rules.maxLength(200)]),
    content: schema.string([rules.minLength(10)])
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'title.required': 'Message Title is required',
    'content.required': 'Message Content is required',
    'title.minLength': 'Message Title must be 4 or more characters',
    'title.maxLength': 'Message Title must not be greater than 200 characters',
    'content.minLength': 'Message Content must be 10 or more characters',
    'recipients.minLength': 'Message Recipients must be at least 1'
  }
}
