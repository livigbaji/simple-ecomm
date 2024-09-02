import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegistrationResponseDto } from '../src/modules/users/dtos/response.dto';
import { UserService } from '../src/modules/users/services/user.service';
import { createProducts } from './data';
import { ProductService } from '../src/modules/products/services/product.service';
import { Product } from '../src/modules/products/entities/product.entity';
import { In } from 'typeorm';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let productService: ProductService;
  const adminEmail = 'test.browse.admin@email.com';
  let admin: RegistrationResponseDto;
  let user: RegistrationResponseDto;
  let bannedUser: RegistrationResponseDto;
  let products: Product[];
  let bannedProducts: Product[];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get(UserService);
    productService = app.get(ProductService);

    if (!admin) {
      admin = await userService.createUser(
        {
          email: adminEmail,
          password: '123456',
          name: 'admin reviewer one',
        },
        true,
      );

      user = await userService.createUser({
        email: 'random@test.com',
        password: '123456',
        name: 'random user creator one',
      });

      bannedUser = await userService.createUser({
        email: 'random.risk@test.com',
        password: '123456',
        name: 'risky user creator one',
      });

      products = await createProducts(5, user.user, productService);
      bannedProducts = await createProducts(5, bannedUser.user, productService);
    }
    await app.init();
  });

  afterAll(async () => {
    await productService.removeProduct({
      id: In([
        ...products.map(({ id }) => id),
        ...bannedProducts.map(({ id }) => id),
      ]),
    });
    await userService.deleteUser({
      email: In([adminEmail, user.user.email, bannedUser.user.email]),
    });
  });

  it('/products (GET)', async () => {
    await productService.approve(products.at(0).id, admin.user.id);

    const response = await request(app.getHttpServer())
      .get('/products/browse')
      .expect(200);

    expect(response.body).toMatchObject({
      total: expect.any(Number),
      data: expect.any(Array),
    });

    console.log(response.body.data);

    expect(response.body.data.at(0)).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      status: expect.stringMatching('APPROVED'),
      quantity: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
