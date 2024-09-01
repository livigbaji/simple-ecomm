import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../modules/users/services/user.service';
import { Reflector } from '@nestjs/core';
import { IS_ADMIN_ROLE_ACTIVE } from '../config';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    @Inject(Reflector.name) private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header: string = req.get('Authorization');


    if (!header || !header.startsWith('Bearer')) {
      return false;
    }

    const isAdmin = this.reflector.get<boolean>(
      IS_ADMIN_ROLE_ACTIVE,
      context.getHandler(),
    );

    req.user = await this.userService.verifyToken(header.slice(7), isAdmin);

    return !!req.user;
  }
}
