import { Role } from 'App/Models'

interface RoleInterface {
  id: string
  name: string
  code: string
}

export class RoleResource {
  public static single(role: Role): RoleInterface {
    return {
      id: role.id,
      name: role.name,
      code: role.code,
    }
  }
  public static collection(roles: Role[]): RoleInterface[] {
    return roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        code: role.code,
      }
    })
  }
}
