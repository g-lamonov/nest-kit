import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Builder } from 'src/utils/test-utils/builders';
import { DatabaseModule } from '../../../database/database.module';
import { UserRepository } from '../../../database/repositories/user.repository';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from './users.module';
import { AuthModule } from '../auth/auth.module';
import { SessionRepository } from 'src/database/repositories/session.repository';

describe('UsersController', () => {
  let app: INestApplication;

  let repository: UserRepository;
  let authService: AuthService;
  let sessionRepository: SessionRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AuthModule, UsersModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    repository = app.get(UserRepository);
    sessionRepository = app.get(SessionRepository);
    authService = app.get(AuthService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users/profile', () => {
    it('Should get profile', async () => {
      const userData = repository.create(Builder.User.generate());
      const user = await repository.save(userData);
      const session = await sessionRepository.createSession(user.id);
      const tokens = await authService.createTokens(session.id);

      const res = await request(app.getHttpServer())
        .get('/v1/users/profile')
        .set('Authorization', `Bearer ${tokens.accessToken}`)
        .expect(HttpStatus.OK);

      expect(res.body.id).toBe(user.id);
    });
  });
});
