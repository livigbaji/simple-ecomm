import { Controller, Delete, Get, Param, Patch, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { ViewUsersResponseDto } from '../dtos/response.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOkResponse({
    type: ViewUsersResponseDto,
  })
  viewUsers(@Query() pagination: PaginationDto) {
    return this.userService.viewUsers(pagination);
  }

  @Patch('/:userId/ban')
  @ApiOkResponse({
    type: ViewUsersResponseDto,
  })
  banUser(@Param('userId') userId: string) {
    return this.userService.banUser(userId);
  }

    @Delete('/:userId/ban')
    @ApiOkResponse({
        type: ViewUsersResponseDto,
    })
    unbanUser(@Param('userId') userId: string) {
        return this.userService.unBanUser(userId);
    }
}
