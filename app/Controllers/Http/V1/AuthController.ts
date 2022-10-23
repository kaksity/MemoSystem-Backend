import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { username, password } = request.body()

    const validSchema = schema.create({
      username: schema.string([
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      password: schema.string([rules.minLength(8), rules.alphaNum()]),
    })

    await request.validate({
      schema: validSchema,
    })

    // Check if the user exist
    const token = await auth.use('api').attempt(username, password)
    const data = {
      success: true,
      access_token: token,
    }
    return response.json(data)
  }
}
