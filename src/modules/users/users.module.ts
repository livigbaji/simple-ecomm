import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { AdminsController } from './controllers/admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './controllers/auth.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, AdminsController, AuthController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
