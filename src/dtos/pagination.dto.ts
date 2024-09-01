import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    example: 0,
  })
  @Min(0)
  @IsInt()
  @Type(() => Number)
  readonly page: number = 0;

  @ApiProperty({
    example: 100,
  })
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  readonly size: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  search: string;
}

export class PaginatedResponseDto {
  @ApiProperty({})
  total: number;
}
