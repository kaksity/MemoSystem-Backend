import Hash from '@ioc:Adonis/Core/Hash'

export class AuthService {
  /**
   * @description
   * @author Dauda Pona
   * @param {{
   *     password: string
   *     passwordHash: string
   *   }} {
   *     password,
   *     passwordHash,
   *   }
   * @returns {*}  {Promise<boolean>}
   * @memberof AuthService
   */
  public async verifyPassword({
    password,
    passwordHash,
  }: {
    password: string
    passwordHash: string
  }): Promise<boolean> {
    return Hash.verify(passwordHash, password)
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {string} password
   * @returns {*}  {Promise<string>}
   * @memberof AuthService
   */
  public async hashPassword(password: string): Promise<string> {
    return Hash.make(password)
  }
}
