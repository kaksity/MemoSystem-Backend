import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env';

export default class extends BaseSeeder {
  public async run () {
    const adminData = [{
      username: Env.get('ADMIN_USERNAME'),
      fullName: Env.get('ADMIN_FULL_NAME'),
      roleId: '',
      password: Env.get('ADMIN_PASSWORD') 

    }]
    // Write your database queries inside the run method
    Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await User.truncate(true)
    await User.createMany(adminData)
    Database.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
