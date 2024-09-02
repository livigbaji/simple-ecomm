import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { User } from '../../users/entities/user.entity';

export class DeletedProductDto {
  @ApiProperty()
  deleted: boolean;
}

export class UpdatedProductDto {
  @ApiProperty()
  updated: boolean;
}

export class ApprovedProductDto {
  @ApiProperty()
  approved: boolean;
}

export class RejectedProductDto {
  @ApiProperty()
  rejected: boolean;
}

class PopulatedProductDto extends Product {
  @ApiProperty()
  owner: User;
}

export class BrowseProductsResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty({
    isArray: true,
    type: PopulatedProductDto,
  })
  data: PopulatedProductDto[];
}
