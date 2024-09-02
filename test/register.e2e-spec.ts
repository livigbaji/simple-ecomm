import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/users/services/user.service';
import { In } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const userEmail = 'test.auth.user@test.com';
  const adminEmail = 'test.auth.admin@test.com';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const userService = app.get(UserService);
    await userService.deleteUser({
      email: In([userEmail, adminEmail]),
    });
  });

  it('/auth/register/user (POST) passes for new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register/user')
      .send({
        email: userEmail,
        password: 'test.password',
        name: 'test.name',
      })
      .expect(201);
    expect(response.body).toMatchObject({
      user: {
        email: userEmail,
        name: 'test.name',
        id: expect.any(String),
        isAdmin: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      token: expect.any(String),
    });
  });

  it('/auth/register/user (POST) fails for existing email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register/user')
      .send({
        email: userEmail,
        password: 'test.password',
        name: 'test.name',
      })
      .expect(400);
    expect(response.body).toMatchObject({
      email: `Email ${userEmail} already exists`,
    });
  });

  it('/auth/register/admin (POST) passes for new admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register/admin')
      .send({
        email: adminEmail,
        password: 'test.password',
        name: 'test.admin.name',
      })
      .expect(201);
    expect(response.body).toMatchObject({
      user: {
        email: adminEmail,
        name: 'test.admin.name',
        id: expect.any(String),
        isAdmin: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      token: expect.any(String),
    });
  });
});
