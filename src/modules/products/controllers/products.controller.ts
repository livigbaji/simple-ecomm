import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from "../services/product.service";
import { CreateProductDto } from "../dtos/product.dto";

@ApiTags('Products')
@Controller('products')
export class ProductsController {

  constructor(
    private readonly productService: ProductService
  ) {
  }

  @Post()
  createProduct(
    @Body() newProduct: CreateProductDto
  ) {
    return this.productService.createProduct(newProduct)
  }

  @Put(':productId')
  updateProduct(
    @Body() newProduct: CreateProductDto,
  @Param('productId') id: string,
  ) {
    return this.productService.updateProduct(id, 'TODO: actual user', newProduct)
  }

  @Delete(':productId')
  deleteProduct(
    @Param('productId') id: string,
  ) {
    return this.productService.deleteProduct(id, 'TODO: actual user')
  }


  @Patch(':productId/review')
  approve(
    @Param('productId') id: string,
  ) {
    return this.productService.approve(id, '3bf4bc96-01ad-4f9a-90b8-e436f80cf874');
  }

  @Delete(':productId/review')
  reject(
    @Param('productId') id: string,
  ) {
    return this.productService.reject(id, '3bf4bc96-01ad-4f9a-90b8-e436f80cf874');
  }

}
