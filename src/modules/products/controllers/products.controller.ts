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
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/product.dto';
import {
  AdminOnly,
  CurrentUser,
  LoggedInUser,
  UserOnly,
} from 'src/decorators/logged-in.decorator';
import { User } from '../../users/entities/user.entity';
import { PaginationDto } from '../../../dtos/pagination.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UserOnly()
  createProduct(
    @Body() newProduct: CreateProductDto,
    @CurrentUser() user: User,
  ) {
    return this.productService.createProduct(newProduct, user);
  }

  @Get()
  @LoggedInUser()
  viewProducts(@Query() pagination: PaginationDto, @CurrentUser() user: User) {
    return this.productService.viewProducts(pagination, user);
  }

  @Get('browse')
  browseProducts(@Query() pagination: PaginationDto) {
    return this.productService.viewProducts(pagination);
  }

  @Put(':productId')
  @UserOnly()
  updateProduct(
    @Body() newProduct: CreateProductDto,
    @Param('productId') id: string,
    @CurrentUser() user: User,
  ) {
    return this.productService.updateProduct(id, user.id, newProduct);
  }

  @Delete(':productId')
  @UserOnly()
  deleteProduct(@Param('productId') id: string, @CurrentUser() user: User) {
    return this.productService.deleteProduct(id, user.id);
  }

  @Patch(':productId/review')
  @AdminOnly()
  approve(@Param('productId') id: string, @CurrentUser() user: User) {
    return this.productService.approve(id, user.id);
  }

  @Delete(':productId/review')
  @AdminOnly()
  reject(@Param('productId') id: string, @CurrentUser() user: User) {
    return this.productService.reject(id, user.id);
  }
}
