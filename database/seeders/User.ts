import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await UserFactory.merge({ email: 'Jhon.Doec@gmail.com' }).create()
  }
}
