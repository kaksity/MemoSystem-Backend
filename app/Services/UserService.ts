import User from '../Models/User'

export class UserService {
  /**
   * @description
   * @author Dauda Pona
   * @param {string} username
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserService
   */
  public async getUserByUsername(username: string): Promise<User | null> {
    return User.findBy('username', username)
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {{
   *     username: string
   *     passwordHash: string
   *   }} {
   *     username,
   *     passwordHash,
   *   }
   * @returns {*}  {Promise<User>}
   * @memberof UserService
   */
  public async createUser({
    username,
    passwordHash,
  }: {
    username: string
    passwordHash: string
  }): Promise<User> {
    return User.create({ username, password: passwordHash })
  }
}
