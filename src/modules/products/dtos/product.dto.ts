import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";


export enum ProductStatusEnum {
  PENDING_REVIEW = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}


export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsPositive()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;
}
