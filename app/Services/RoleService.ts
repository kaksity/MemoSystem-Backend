import { Role } from '../Models'
export class RoleService {
  public async createRole({ name, code }) {
    return Role.create({ name, code })
  }
  public async getRoleByCode(code: string) {
    return Role.findBy('code', code)
  }
}
