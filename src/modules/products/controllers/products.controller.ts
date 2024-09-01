import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/product.dto';
import {
  AdminOnly,
  CurrentUser,
  UserOnly,
} from 'src/decorators/logged-in.decorator';
import { User } from '../../users/entities/user.entity';

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
