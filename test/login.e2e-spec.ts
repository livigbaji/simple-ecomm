import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/users/services/user.service';
import { In } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const userEmail = 'test.login.user@test.com';
  const adminEmail = 'test.login.admin@test.com';

  afterAll(async () => {
    const userService = app.get(UserService);
    await userService.deleteUser({
      email: In([userEmail, adminEmail]),
    });
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) admin can login', async () => {
    await app.get(UserService).createUser(
      {
        email: adminEmail,
        password: '123456',
        name: 'admin',
      },
      true,
    );

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: adminEmail,
        password: '123456',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      user: {
        email: adminEmail,
        name: 'admin',
        id: expect.any(String),
        isAdmin: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      token: expect.any(String),
    });
  });

  it('/auth/login (POST) user can login', async () => {
    await app.get(UserService).createUser({
      email: userEmail,
      password: '123456',
      name: 'user',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userEmail,
        password: '123456',
      })
      .expect(200);

    expect(response.body).toMatchObject({
      user: {
        email: userEmail,
        name: 'user',
        id: expect.any(String),
        isAdmin: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      token: expect.any(String),
    });
  });

  it('/auth/login (POST) incorrect email fails to login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'random@email.com',
        password: '123456',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      email: 'Incorrect email',
    });
  });

  it('/auth/login (POST) incorrect password fails to login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userEmail,
        password: '1234567',
      })
      .expect(400);

    expect(response.body).toMatchObject({
      password: 'Incorrect password',
    });
  });
});
