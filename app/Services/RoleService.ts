import { Role } from '../Models'
export class RoleService {
  /**
   * @description
   * @author Dauda Pona
   * @param {*} { name, code }
   * @returns {*}  {Promise<Role>}
   * @memberof RoleService
   */
  public async createRole({ name, code }): Promise<Role> {
    return Role.create({ name, code })
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {string} code
   * @returns {*}  {(Promise<Role | null>)}
   * @memberof RoleService
   */
  public async getRoleByCode(code: string): Promise<Role | null> {
    return Role.findBy('code', code)
  }

  /**
   * @description
   * @author Dauda Pona
   * @param {number} id
   * @returns {*}  {(Promise<Role | null>)}
   * @memberof RoleService
   */
  public async getRoleById(id: number): Promise<Role | null> {
    return Role.find(id)
  }
  /**
   * @description
   * @author Dauda Pona
   * @param {Role} role
   * @returns {*}  {Promise<void>}
   * @memberof RoleService
   */
  public async deleteRole(role: Role): Promise<void> {
    await role.delete()
  }
}