import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/database/entity/session.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
