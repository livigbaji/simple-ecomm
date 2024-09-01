import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, ProductStatusEnum } from '../dtos/product.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  createProduct(newProduct: CreateProductDto, user: User) {
    return this.productRepository.save({
      ...newProduct,
      ownerId: user.id,
    });
  }

  async updateProduct(
    product: string,
    owner: string,
    newProduct: CreateProductDto,
  ) {
    const { affected } = await this.productRepository.update(
      {
        id: product,
        ownerId: owner,
        status: In([
          ProductStatusEnum.PENDING_REVIEW,
          ProductStatusEnum.APPROVED,
        ]),
      },
      newProduct,
    );

    return { updated: !!affected };
  }

  async deleteProduct(product: string, owner: string) {
    const { affected } = await this.productRepository.delete({
      id: product,
      ownerId: owner,
      status: In([
        ProductStatusEnum.PENDING_REVIEW,
        ProductStatusEnum.APPROVED,
      ]),
    });

    return { deleted: !!affected };
  }

  viewUserProduct() {
    //TODO paginate
    throw new Error('not implemented');
  }

  viewApprovedProducts() {
    //TODO paginate
    throw new Error('not implemented');
  }

  approve(product: string, reviewer: string) {
    return this.productRepository.update(
      {
        id: product,
        status: ProductStatusEnum.PENDING_REVIEW,
      },
      {
        reviewedBy: reviewer,
        status: ProductStatusEnum.APPROVED,
        isApprovedAt: new Date(),
      },
    );
  }

  reject(product: string, reviewer: string) {
    return this.productRepository.update(
      {
        id: product,
        status: ProductStatusEnum.PENDING_REVIEW,
      },
      {
        reviewedBy: reviewer,
        status: ProductStatusEnum.REJECTED,
        isRejectedAt: new Date(),
      },
    );
  }
}
