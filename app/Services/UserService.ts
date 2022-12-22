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
    fullName,
    roleId,
  }: {
    username: string
    passwordHash: string
    fullName: string
    roleId: number
  }): Promise<User> {
    return User.create({ username, password: passwordHash, fullName, roleId })
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {number} id
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserService
   */
  public async getUserById(id: number): Promise<User | null> {
    return User.find(id)
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {User} user
   * @returns {*}  {Promise<void>}
   * @memberof UserService
   */
  public async deleteUser(user: User): Promise<void> {
    await user.delete()
  }

  /**
   * @description
   * @author Dauda Pona
   * @returns {*}  {Promise<User[]>}
   * @memberof UserService
   */
  public async getAllUsers(): Promise<User[]> {
    return User.all()
  }
}
