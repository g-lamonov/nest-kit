import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Builder } from 'src/utils/test-utils/builders';
import { DatabaseModule } from '../../../database/database.module';
import { UserEntity } from '../../../database/entity/user.entity';
import { UserRepository } from '../../../database/repositories/user.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let app: TestingModule;
  let controller: UsersController;

  let repository: UserRepository;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([UserEntity])],
      controllers: [UsersController],
      providers: [UsersService, UserRepository],
    }).compile();

    controller = app.get<UsersController>(UsersController);
    repository = app.get<UserRepository>(UserRepository);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users/profile', () => {
    it('Should get profile', async () => {
      const user = repository.create(Builder.User.generate());
      await repository.save(user);
      const response = await controller.profile({
        user,
      });

      expect(response.id).toBe(user.id);
    });
  });
});
