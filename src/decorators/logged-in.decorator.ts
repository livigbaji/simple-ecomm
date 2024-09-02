import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse } from '@nestjs/swagger';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { User } from '../modules/users/entities/user.entity';
import { IS_ADMIN_ROLE_ACTIVE } from '../config';
import { ForbiddenRequest } from '../dtos/errors.dto';
import { isNull } from 'lodash';

export const IsAdmin = (isAdmin: boolean) =>
  SetMetadata(IS_ADMIN_ROLE_ACTIVE, isAdmin);

export function LoggedInUser(isAdmin?: boolean) {
  return applyDecorators.apply(null, [
    ...(!isNull(isAdmin) ? [IsAdmin(isAdmin)] : []),
    ApiBearerAuth(),
    ApiForbiddenResponse({
      type: ForbiddenRequest,
    }),
    UseGuards(LoggedInGuard),
  ]);
}

export function AdminOnly() {
  return LoggedInUser(true);
}

export function UserOnly() {
  return LoggedInUser(false);
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    return ctx.switchToHttp().getRequest().user;
  },
);
