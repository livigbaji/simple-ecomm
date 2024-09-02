import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, ILike, In, Repository } from "typeorm";
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
    return this.productRepository
      .save({
        ...newProduct,
        ownerId: user.id,
      })
      .catch((e) => {
        console.log('save failed', e);
        throw new InternalServerErrorException();
      });
  }

  async viewProducts(pagination: PaginationDto, user?: User) {
    const { page, size, search } = pagination;
    const pageSize = +size || 100;
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
        // if it is a guest user then filter by approved, removed banned users product
        ...(!user && {
          status: ProductStatusEnum.APPROVED,
          owner: {
            isBanned: false,
          }
        }),
      },

      // if product list is being viewed by admin or guest user
      relations: {
        owner: !user || user.isAdmin,
      },

      take: pageSize,
      skip: (+page || 0) * pageSize,
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

  async approve(product: string, reviewer: string) {
    const { affected } = await this.productRepository.update(
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

    return { approved: !!affected };
  }

  async reject(product: string, reviewer: string) {
    const { affected } = await this.productRepository.update(
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

    return { rejected: !!affected };
  }

  removeProduct(query: FindOptionsWhere<Product>) {
    return this.productRepository.delete(query);
  }
}
