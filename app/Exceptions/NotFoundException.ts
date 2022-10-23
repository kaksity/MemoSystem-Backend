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
| new NotFoundException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class NotFoundException extends Exception {
  /**
   * Since this exception is always not found only the message will change
   */
  constructor(message: string) {
    super(message, 404, 'RESOURCE_NOT_FOUND')
  }
  public async handle(error: this, ctx: HttpContextContract) {
    return ctx.response.status(error.status).json({
      type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
      title: 'The specified resource was not found.',
      detail: error.message,
    })
  }
}
