import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, ProductStatusEnum } from '../dtos/product.dto';
import { User } from '../../users/entities/user.entity';
import { PaginationDto } from 'src/dtos/pagination.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  createProduct(newProduct: CreateProductDto, user: User) {
    return this.productRepository.save(
      this.productRepository.create({
        ...newProduct,
        ownerId: user.id,
      }),
    );
  }

  async viewProducts(pagination: PaginationDto, user?: User) {
    const { page, size, search } = pagination;
    const [products, count] = await this.productRepository.findAndCount({
      where: {
        // search through the name column if search term is passed
        ...(search && {
          Or: [
            { name: ILike(`%${search}%`) },
            { description: ILike(`%${search}%`) },
          ],
        }),
        // if it is a logged-in user and not admin, filter by owner ID
        ...(user &&
          !user.isAdmin && {
            ownerId: user.id,
          }),
        // if it is a guest user then filter by approved
        ...(!user && {
          status: ProductStatusEnum.APPROVED,
        }),
      },

      take: size,
      skip: page * size,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      total: count,
      data: products,
    };
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
