import { NULL_OBJECT } from 'App/Helpers/GeneralPurpose/CustomMessages/SystemCustomMessages'
import Role from 'App/Models/Role'
import DeleteRecordPayloadOptions from 'App/TypeChecking/GeneralPurpose/DeleteRecordPayloadOptions'
import RoleObjectInterface from 'App/TypeChecking/ModelManagement/RoleObjectInterface'
export default class RoleService {
  /**
   * @description
   * @author Dauda Pona
   * @param {Partial<RoleObjectInterface>} createRoleOptions
   * @returns {*}  {Promise<Role>}
   * @memberof RoleService
   */
  public async createRoleRecord(createRoleOptions: Partial<RoleObjectInterface>): Promise<Role> {
    const { transaction } = createRoleOptions
    const role = new Role()

    Object.assign(role, createRoleOptions)

    if (transaction) {
      role.useTransaction(transaction)
    }

    await role.save()
    return role
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} code
   * @returns {*}  {(Promise<Role | null>)}
   * @memberof RoleService
   */
  public async getRoleByCode(code: string): Promise<Role | null> {
    const role = await Role.query().where('code', code).first()
    if (role === NULL_OBJECT) {
      return NULL_OBJECT
    }
    return role
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} id
   * @returns {*}  {(Promise<Role | null>)}
   * @memberof RoleService
   */
  public async getRoleById(id: string): Promise<Role | null> {
    const role = await Role.query().where('id', id).first()
    if (role === NULL_OBJECT) {
      return NULL_OBJECT
    }
    return role
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {DeleteRecordPayloadOptions} deleteRoleRecordPayloadOptions
   * @returns {*}  {Promise<void>}
   * @memberof RoleService
   */
  public async deleteRoleRecord(
    deleteRoleRecordPayloadOptions: DeleteRecordPayloadOptions
  ): Promise<void> {
    const { entityId, transaction } = deleteRoleRecordPayloadOptions

    const role = await this.getRoleById(entityId)

    if (transaction) {
      role!.useTransaction(transaction)
    }

    await role!.delete()
  }
  /**
   * @description
   * @author Dauda Pona
   * @returns {*}  {Promise<Role[]>}
   * @memberof RoleService
   */
  public async getAllRoles(): Promise<Role[]> {
    return Role.query().orderBy('name', 'asc')
  }
}
