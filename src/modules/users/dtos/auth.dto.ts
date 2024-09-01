import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    format: 'email',
  })
  email: string;

  @ApiProperty({
    format: 'name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    format: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto extends PickType(RegisterUserDto, [
  'password',
  'email',
] as const) {}
