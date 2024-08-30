import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { AdminsController } from './controllers/admins.controller';

@Module({
  controllers: [UsersController, AdminsController]
})
export class UsersModule {}
