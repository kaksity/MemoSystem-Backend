import User from '../../Models/User'
interface UserInterface {
  id: number
  fullName: string
  username: string
  roleId: number
}

export class UserResource {
  public static single(user: User): UserInterface {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      roleId: user.roleId,
    }
  }
  public static collection(users: User[]): UserInterface[] {
    return users.map((user) => {
      return this.single(user)
    })
  }
}
