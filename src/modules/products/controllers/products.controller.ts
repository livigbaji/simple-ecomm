import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/product.dto';
import {
  AdminOnly,
  CurrentUser,
  LoggedInUser,
  UserOnly,
} from '../../../decorators/logged-in.decorator';
import { User } from '../../users/entities/user.entity';
import { PaginationDto } from '../../../dtos/pagination.dto';
import {
  ApprovedProductDto,
  BrowseProductsResponseDto,
  DeletedProductDto,
  RejectedProductDto,
  UpdatedProductDto,
} from '../dtos/response.dto';
import { Product } from '../entities/product.entity';
import { BadRequestDto } from '../../../dtos/errors.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UserOnly()
  @ApiOkResponse({
    type: Product,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  @ApiOperation({
    summary: `Creates a new product for a user`,
  })
  createProduct(
    @Body() newProduct: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.createProduct(newProduct, user);
  }

  @Get()
  @LoggedInUser()
  @ApiOkResponse({
    type: BrowseProductsResponseDto,
  })
  @ApiOperation({
    summary: `Get product listings for user or admin`,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  viewProducts(@Query() pagination: PaginationDto, @CurrentUser() user: User) {
    return this.productService.viewProducts(pagination, user);
  }

  @Get('browse')
  @ApiOkResponse({
    type: BrowseProductsResponseDto,
  })
  @ApiOperation({
    summary: `Approved and non-banned seller's products for unauthenticated users`,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  browseProducts(@Query() pagination: PaginationDto) {
    return this.productService.viewProducts(pagination);
  }

  @Put(':productId')
  @UserOnly()
  @ApiOkResponse({
    type: UpdatedProductDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestDto,
  })
  @ApiOperation({
    summary: `Updates user's own product`,
  })
  updateProduct(
    @Body() newProduct: CreateProductDto,
    @Param('productId') id: string,
    @CurrentUser() user: User,
  ) {
    return this.productService.updateProduct(id, user.id, newProduct);
  }

  @Delete(':productId')
  @ApiOkResponse({
    type: DeletedProductDto,
  })
  @UserOnly()
  @ApiOperation({
    summary: `Deletes user's own product`,
  })
  deleteProduct(@Param('productId') id: string, @CurrentUser() user: User) {
    return this.productService.deleteProduct(id, user.id);
  }

  @Patch(':productId/review')
  @ApiOkResponse({
    type: ApprovedProductDto,
  })
  @AdminOnly()
  @ApiOperation({
    summary: 'Approves a product pending review',
  })
  approve(@Param('productId') id: string, @CurrentUser() user: User) {
    return this.productService.approve(id, user.id);
  }

  @Delete(':productId/review')
  @ApiOkResponse({
    type: RejectedProductDto,
  })
  @AdminOnly()
  @ApiOperation({
    summary: 'Rejects a product pending review',
  })
  reject(@Param('productId') id: string, @CurrentUser() user: User) {
    return this.productService.reject(id, user.id);
  }
}
