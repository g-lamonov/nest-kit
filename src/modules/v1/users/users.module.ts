import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import JwtAccessStrategy from '../auth/strategies/jwt-access.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, JwtAccessStrategy, UserRepository],
})
export class UsersModule {}
