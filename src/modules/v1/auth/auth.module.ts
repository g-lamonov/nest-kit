import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from 'src/database/entity/session.entity';
import { UserEntity } from 'src/database/entity/user.entity';
import { SessionRepository } from 'src/database/repositories/session.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import JwtRefreshStrategy from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, SessionEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    SessionRepository,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
