import { ApiProperty } from '@nestjs/swagger';

export class ErrorsDto {
  @ApiProperty({
    example: 'bad request',
  })
  error: string;
  @ApiProperty({
    example: '4xx',
  })
  statusCode: number;
}

export class BadRequestDto extends ErrorsDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  message: string[];
}

export class ForbiddenRequest extends ErrorsDto {
  @ApiProperty({
    example: 'Forbidden resource',
  })
  message: string;
}
