import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/database/entity/session.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { SessionRepository } from 'src/database/repositories/session.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import JwtAccessStrategy from '../auth/strategies/jwt-access.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    JwtAccessStrategy,
    SessionRepository,
  ],
})
export class UsersModule {}
