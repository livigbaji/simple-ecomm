import { Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { PaginationDto } from '../../../dtos/pagination.dto';
import {
  BannedUserResponseDto,
  UnBannedUserResponseDto,
  ViewUsersResponseDto,
} from '../dtos/response.dto';
import { AdminOnly } from '../../../decorators/logged-in.decorator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOkResponse({
    type: ViewUsersResponseDto,
  })
  @AdminOnly()
  viewUsers(@Query() pagination: PaginationDto) {
    return this.userService.viewUsers(pagination);
  }

  @Patch('/:userId/ban')
  @ApiOkResponse({
    type: BannedUserResponseDto,
  })
  @AdminOnly()
  banUser(@Param('userId') userId: string) {
    return this.userService.banUser(userId);
  }

  @Delete('/:userId/ban')
  @ApiOkResponse({
    type: UnBannedUserResponseDto,
  })
  @AdminOnly()
  unbanUser(@Param('userId') userId: string) {
    return this.userService.unBanUser(userId);
  }
}
