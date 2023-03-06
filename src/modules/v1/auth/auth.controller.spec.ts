import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/database/repositories/user.repository';
import { LoginDto } from './dto/login-payload.dto';
import { Builder } from 'src/utils/test-utils/builders';
import { Mock } from 'src/utils/test-utils/mocks';
import { RegistrationDto } from './dto/registration-payload.dto';
import { SessionRepository } from 'src/database/repositories/session.repository';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Auth module', () => {
  let app: INestApplication;
  let controller: AuthController;

  let userRepository: UserRepository;
  let sessionRepository: SessionRepository;

  let authService: AuthService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    controller = app.get(AuthController);
    userRepository = app.get(UserRepository);
    authService = app.get(AuthService);
    sessionRepository = app.get(SessionRepository);
  });

  afterEach(async () => {
    app.close();
  });

  describe('POST /auth/sign-in', () => {
    it('should return a tokens if credentials are correct', async () => {
      const userData = Builder.User.generate();
      const user = userRepository.create(userData);
      await userRepository.save(user);

      const body: LoginDto = {
        email: userData.email,
        password: userData.password,
      };
      const result = await controller.login(body);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');

      const res = await request(app.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(body)
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should throw an error if user does not exist', async () => {
      const body: LoginDto = {
        email: Mock.PersonalInfo.email(),
        password: Mock.PersonalInfo.password(),
      };

      await request(app.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(body)
        .expect(400);
    });

    it('should throw an error if password is incorrect', async () => {
      const userData = Builder.User.generate();
      const user = userRepository.create(userData);
      await userRepository.save(user);

      const body: LoginDto = { email: user.email, password: 'password' };
      await request(app.getHttpServer())
        .post('/v1/auth/sign-in')
        .send(body)
        .expect(400);
    });
  });

  describe('POST /auth/sign-up', () => {
    it('should create a new user', async () => {
      const body: RegistrationDto = {
        email: Mock.PersonalInfo.email(),
        password: Mock.PersonalInfo.password(),
      };

      request(app.getHttpServer())
        .post('/v1/auth/sign-up')
        .send(body)
        .expect(201);
    });

    it('should throw an error if user already exists', async () => {
      const userData = Builder.User.generate();
      const user = userRepository.create(userData);
      await userRepository.save(user);

      const body: RegistrationDto = {
        email: userData.email,
        password: userData.password,
      };

      await request(app.getHttpServer())
        .post('/v1/auth/sign-up')
        .send(body)
        .expect(400);
    });
  });

  describe('POST /auth/token/refresh', () => {
    it('should return new access token if refresh token is valid', async () => {
      const user = userRepository.create(Builder.User.generate());
      await userRepository.save(user);
      const session = await sessionRepository.createSession(user.id);
      const tokens = await authService.createTokens(session.id);

      const res = await request(app.getHttpServer())
        .post('/v1/auth/token/refresh')
        .set('Authorization', `Bearer ${tokens.refreshToken}`)
        .expect(201);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/auth/token/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(res.body.message).toEqual('Unauthorized');
    });
  });
});
