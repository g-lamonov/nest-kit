import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import config from 'src/config/config';
import { JwtPayload } from './jwt-access.strategy';
import { SessionRepository } from 'src/database/repositories/session.repository';
import { UserRepository } from 'src/database/repositories/user.repository';
import { AuthServiceErrors } from '../auth.service';
import { UserEntity } from 'src/database/entity/user.entity';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.jwt.refresh.secret,
    });
  }
  @Inject(SessionRepository)
  private readonly _sessionRepository: SessionRepository;

  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const session = await this._sessionRepository.findById(payload.sessionId);
    if (!session)
      throw new HttpException(
        AuthServiceErrors.SESSION_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );

    const user = await this._userRepository.findById(session.userId);

    if (!user)
      throw new HttpException(
        AuthServiceErrors.TOKEN_INVALID,
        HttpStatus.UNAUTHORIZED,
      );

    return user;
  }
}
