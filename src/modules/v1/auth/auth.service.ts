import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../../../config/config';
import { UserRepository } from 'src/database/repositories/user.repository';
import { JwtPayload } from './strategies/jwt-access.strategy';
import { RegistrationDto } from './dto/registration-payload.dto';
import { LoginDto } from './dto/login-payload.dto';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { SessionRepository } from 'src/database/repositories/session.repository';

export enum AuthServiceErrors {
  USER_ALREADY_EXISTS = 'User already exists',
  WRONG_PASSWORD = 'Wrong password',
  INCORRECT_TOKEN = 'Incorrect token',
  TOKEN_INVALID = 'Token invalid',
  SESSION_NOT_FOUND = 'Session not found',
}

@Injectable()
export class AuthService {
  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  @Inject(SessionRepository)
  private readonly _sessionRepository: SessionRepository;

  @Inject(JwtService)
  private readonly _jwtService: JwtService;

  public createTokens(sessionId: string): JwtTokensDto {
    const payload: JwtPayload = {
      sessionId,
    };

    const accessToken = this._jwtService.sign(payload, {
      secret: config.auth.jwt.access.secret,
      expiresIn: config.auth.jwt.access.lifetime,
    });

    const refreshToken = this._jwtService.sign(payload, {
      secret: config.auth.jwt.refresh.secret,
      expiresIn: config.auth.jwt.refresh.lifetime,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginDto): Promise<JwtTokensDto> {
    const user = await this._userRepository.findByEmail(data.email, {
      select: ['id', 'password'],
    });

    if (!user || !(await user.passwordCompare(data.password)))
      throw new HttpException(
        AuthServiceErrors.WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );

    const session = await this._sessionRepository.createSession(user.id);

    const tokens = this.createTokens(session.id);
    return tokens;
  }

  async register(data: RegistrationDto): Promise<void> {
    let user = await this._userRepository.findByEmail(data.email);

    if (user)
      throw new HttpException(
        AuthServiceErrors.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );

    user = this._userRepository.create(data);
    await this._userRepository.save(user);
  }

  async refreshToken(userId: string): Promise<JwtTokensDto> {
    const session = await this._sessionRepository.createSession(userId);
    const tokens = this.createTokens(session.id);
    return tokens;
  }
}
