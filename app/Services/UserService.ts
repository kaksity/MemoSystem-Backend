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
}
