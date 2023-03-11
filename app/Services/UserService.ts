import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import User from 'App/Models/User'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import UpdateRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/UpdateRecordPayloadOptions'
import UserObjectInterface from 'App/TypeChecking/ModelManagement/UserObjectInterface'
import { DateTime } from 'luxon'

export default class UserService {
  /**
   * @description
   * @author Dauda Pona
   * @param {string} username
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserService
   */
  public async getUserByUsername(username: string): Promise<User | null> {
    const user = await User.query().preload('role').where('username', username).first()

    if (user === NULL_OBJECT) {
      return NULL_OBJECT
    }

    return user
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {Partial<UserObjectInterface>} createUserOptions
   * @returns {*}  {Promise<User>}
   * @memberof UserService
   */
  public async createUserRecord(createUserOptions: Partial<UserObjectInterface>): Promise<User> {
    const { transaction } = createUserOptions

    const user = new User()

    Object.assign(user, createUserOptions)

    if (transaction) {
      user.useTransaction(transaction)
    }

    await user.save()
    return user
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserService
   */
  public async getUserById(id: string): Promise<User | null> {
    const user = await User.query().where('id', id).first()

    if (user === NULL_OBJECT) {
      return NULL_OBJECT
    }

    return user
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {DeleteRecordPayloadOptions} deleteUserRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof UserService
   */
  public async deleteUserRecord(
    deleteUserRecordPayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteUserRecordPayloadOptions

    const user = await this.getUserById(entityId)

    if (transaction) {
      user!.useTransaction(transaction)
    }

    await user!.softDelete()
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
   * @param {UpdateRecordPayloadOptions} updateUserRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof UserService
   */
  public async updateUserRecord(
    updateUserRecordPayloadOptions: UpdateRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction, modifiedData } = updateUserRecordPayloadOptions

    const user = await this.getUserById(entityId)

    user!.merge(modifiedData)

    if (transaction) {
      user!.useTransaction(transaction)
    }

    await user!.save()
  }
}
