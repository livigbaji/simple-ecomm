import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RegistrationResponseDto } from '../src/modules/users/dtos/response.dto';
import { UserService } from '../src/modules/users/services/user.service';
import { In } from 'typeorm';
import { ProductService } from '../src/modules/products/services/product.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let productService: ProductService;
  const email = 'test.product.user@email.com';
  let user: RegistrationResponseDto;
  const products = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = app.get(UserService);
    productService = app.get(ProductService);

    if (!user) {
      user = await app.get(UserService).createUser({
        name: 'Test User',
        password: 'test_password',
        email,
      });
    }
    await app.init();
  });

  afterAll(async () => {
    await productService.removeProduct({
      id: In(products),
    });
    await userService.deleteUser({
      email,
    });
  });

  it('/products (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'product name',
        price: 10,
        description: 'lorem ipsum dolor sit amet',
        quantity: 8,
      })
      .auth(user.token, { type: 'bearer' })
      .expect(201)
      .catch((err) => err);

    products.push(response.body.id);

    expect(response.body).toMatchObject({
      ownerId: user.user.id,
      name: 'product name',
      price: 10,
      description: 'lorem ipsum dolor sit amet',
      quantity: 8,
      reviewedBy: null,
      isApprovedAt: null,
      isRejectedAt: null,
      id: expect.any(String),
      status: 'PENDING',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('/products/{productId} (PUT)', () => {
    const productId = products.at(0);
    return request(app.getHttpServer())
      .put(`/products/${productId}`)
      .send({
        name: 'product name',
        price: 10,
        description: 'lorem ipsum dolor sit amet',
        quantity: 8,
      })
      .auth(user.token, { type: 'bearer' })
      .expect(200)
      .expect({
        updated: true,
      });
  });

  it('/products/{productId} (DELETE)', () => {
    const productId = products.at(0);
    return request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .auth(user.token, { type: 'bearer' })
      .expect(200)
      .expect({
        deleted: true,
      });
  });
});
