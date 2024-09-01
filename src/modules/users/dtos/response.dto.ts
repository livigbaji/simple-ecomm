import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { PaginatedResponseDto } from '../../../dtos/pagination.dto';

export class RegistrationResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  token: string;
}

export class ViewUsersResponseDto extends PaginatedResponseDto {
  @ApiProperty({
    isArray: true,
    type: User,
  })
  data: User[];
}
