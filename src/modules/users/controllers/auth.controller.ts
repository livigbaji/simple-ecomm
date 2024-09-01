import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { LoginUserDto, RegisterUserDto } from '../dtos/auth.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrationResponseDto } from '../dtos/response.dto';
import { BadRequestDto } from '../../../dtos/errors.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RegistrationResponseDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  login(@Body() loginRequest: LoginUserDto) {
    return this.userService.loginUser(loginRequest);
  }

  @Post('register/user')
  @ApiCreatedResponse({
    type: RegistrationResponseDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  register(@Body() registerRequest: RegisterUserDto) {
    return this.userService.createUser(registerRequest);
  }

  @Post('register/admin')
  @ApiCreatedResponse({
    type: RegistrationResponseDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  registerAdmin(@Body() registerRequest: RegisterUserDto) {
    return this.userService.createUser(registerRequest, true);
  }
}
