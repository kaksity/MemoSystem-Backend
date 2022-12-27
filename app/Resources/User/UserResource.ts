import User from 'App/Models/User'
import RoleResource from 'App/Resources/Role/RoleResource'

interface UserInterface {
  id: string
  fullName: string
  username: string
  role: RoleResource
}

export class UserResource {
  public static single(user: User): UserInterface {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: RoleResource.single(user.role),
    }
  }
  public static collection(users: User[]): UserInterface[] {
    return users.map((user) => {
      return this.single(user)
    })
  }
}
