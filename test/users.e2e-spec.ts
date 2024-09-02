import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UserService } from '../src/modules/users/services/user.service';
import { RegistrationResponseDto } from '../src/modules/users/dtos/response.dto';
import { In } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const adminEmail = 'test.view.users.admin@test.com';
  const userEmail = 'test.view.users.user1@test.com';
  const otherUserEmail = 'test.view.users.user2@test.com';

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
      email: In([adminEmail, userEmail, otherUserEmail]),
    });
  });

  it('/users (GET) can fails for unauthorized user', () => {
    return request(app.getHttpServer()).get('/users').expect(403).expect({
      message: 'Forbidden resource',
      error: 'Forbidden',
      statusCode: 403,
    });
  });

  describe('Authenticated users', () => {
    let user1: RegistrationResponseDto;
    let admin: RegistrationResponseDto;
    beforeAll(async () => {
      user1 = await app.get(UserService).createUser({
        email: userEmail,
        password: '123456',
        name: 'user number one',
      });

      await app.get(UserService).createUser({
        email: otherUserEmail,
        password: '123456',
        name: 'user number two',
      });

      admin = await app.get(UserService).createUser(
        {
          email: adminEmail,
          password: '123456',
          name: 'admin number one',
        },
        true,
      );
    });

    it('/users (GET) can fails for user token', () => {
      return request(app.getHttpServer())
        .get('/users')
        .auth(user1.token, { type: 'bearer' })
        .expect(403)
        .expect({
          message: 'Forbidden resource',
          error: 'Forbidden',
          statusCode: 403,
        });
    });

    it('/users (GET) can passes for admin token', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .auth(admin.token, { type: 'bearer' })
        .expect(200);
      expect(response.body).toMatchObject({
        total: expect.any(Number),
        data: expect.any(Array),
      });

      expect(response.body.data.at(0)).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        isAdmin: false,
        isBanned: expect.any(Boolean),
        isBannedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('/users/{userId}/ban (PATCH) can ban a user', () => {
      return request(app.getHttpServer())
        .patch(`/users/${user1.user.id}/ban`)
        .auth(admin.token, { type: 'bearer' })
        .expect(200)
        .expect({
          banned: true,
        });
    });

    it('/users/{userId}/ban (DELETE) can unban a user', () => {
      return request(app.getHttpServer())
        .delete(`/users/${user1.user.id}/ban`)
        .auth(admin.token, { type: 'bearer' })
        .expect(200)
        .expect({
          unbanned: true,
        });
    });
  });
});
