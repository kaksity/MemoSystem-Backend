import User from 'App/Models/User'

export default class UserService {
  /**
   * @description
   * @author Dauda Pona
   * @param {string} username
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserService
   */
  public async getUserByUsername(username: string): Promise<User | null> {
    return User.query().preload('role').where('username', username).first()
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
    roleId: string
  }): Promise<User> {
    return User.create({ username, password: passwordHash, fullName, roleId })
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserService
   */
  public async getUserById(id: string): Promise<User | null> {
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
    return User.query().preload('role')
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {User} user
   * @returns {*}  {Promise<void>}
   * @memberof UserService
   */
  public async updateUser(user: User): Promise<void>{
    await user.save()
  }
}
