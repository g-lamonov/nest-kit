import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/database/repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import config from 'src/config/config';
import { LoginDto } from './dto/login-payload.dto';
import { Builder } from 'src/utils/test-utils/builders';
import { Mock } from 'src/utils/test-utils/mocks';
import { RegistrationDto } from './dto/registration-payload.dto';
import { UserEntity } from 'src/database/entity/user.entity';

describe('Auth module', () => {
  let app: TestingModule;
  let controller: AuthController;

  let repository: UserRepository;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        JwtModule.register({
          secret: config.auth.jwt.access.secret,
          signOptions: {
            expiresIn: config.auth.jwt.access.lifetime,
          },
        }),
        TypeOrmModule.forFeature([UserEntity]),
      ],
      controllers: [AuthController],
      providers: [AuthService, UserRepository],
    }).compile();

    controller = app.get(AuthController);
    repository = app.get(UserRepository);
  });

  afterEach(async () => {
    app.close();
  });

  describe('POST /auth/sign-in', () => {
    it('should return a tokens if credentials are correct', async () => {
      const userData = Builder.User.generate();
      const user = repository.create(userData);
      await repository.save(user);

      const body: LoginDto = {
        email: userData.email,
        password: userData.password,
      };
      const result = await controller.login(body);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw an error if user does not exist', async () => {
      const body: LoginDto = {
        email: Mock.PersonalInfo.email(),
        password: Mock.PersonalInfo.password(),
      };

      await expect(controller.login(body)).rejects.toThrow();
    });

    it('should throw an error if password is incorrect', async () => {
      const userData = Builder.User.generate();
      const user = repository.create(userData);
      await repository.save(user);

      const body: LoginDto = { email: user.email, password: 'password' };

      await expect(controller.login(body)).rejects.toThrow();
    });
  });

  describe('POST /auth/sign-up', () => {
    it('should create a new user', async () => {
      const body: RegistrationDto = {
        email: Mock.PersonalInfo.email(),
        password: Mock.PersonalInfo.password(),
      };

      const result = await controller.register(body);
      expect(result).toEqual(undefined);
    });

    it('should throw an error if user already exists', async () => {
      const userData = Builder.User.generate();
      const user = repository.create(userData);
      await repository.save(user);

      const body: RegistrationDto = {
        email: userData.email,
        password: userData.password,
      };

      await expect(controller.register(body)).rejects.toThrow();
    });
  });
});
