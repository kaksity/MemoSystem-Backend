import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run() {
    const roleData = [
      {
        name: 'System Admin',
        code: 'system-admin',
      },
    ]

    // Write your database queries inside the run method

    Database.raw('SET FOREIGN_KEY_CHECKS = 0;')
    await Role.truncate(true)
    await Role.createMany(roleData)
    Database.raw('SET FOREIGN_KEY_CHECKS = 1;')
  }
}
