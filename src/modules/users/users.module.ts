import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { AdminsController } from './controllers/admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AdminsController],
})
export class UsersModule {}
