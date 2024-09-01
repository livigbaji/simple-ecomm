import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({
    example: 'bad request',
  })
  error: string;
  @ApiProperty({
    example: 400,
  })
  statusCode: number;
}
