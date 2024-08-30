import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';

@Module({
  controllers: [ProductsController]
})
export class ProductsModule {}
