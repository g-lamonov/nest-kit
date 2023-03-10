import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config/config';
import { UserRepository } from 'src/database/repositories/user.repository';
import { SessionRepository } from 'src/database/repositories/session.repository';
import { AuthServiceErrors } from '../auth.service';
import { UserEntity } from 'src/database/entity/user.entity';

export interface JwtPayload {
  sessionId: string;
}

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  @Inject(UserRepository)
  private _userRepository: UserRepository;

  @Inject(SessionRepository)
  private _sessionRepository: SessionRepository;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.jwt.access.secret,
    });
  }

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
