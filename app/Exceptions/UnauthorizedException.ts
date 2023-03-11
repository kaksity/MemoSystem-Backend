import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new UnauthorizedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UnauthorizedException extends Exception {
  /**
   * Since this exception is always not found only the message will change
   */
  constructor(message: string) {
    super(message, 403)
  }
  public async handle(error: this, ctx: HttpContextContract) {
    return ctx.response.status(error.status).json({
      success: false,
      type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
      title: 'Unauthorized to perform action on the specified resource',
      detail: error.message,
    })
  }
}
