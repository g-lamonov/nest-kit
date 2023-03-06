import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import config from '../../../config/config';

import { UserRepository } from 'src/app/database/repositories/user.repository';
import { UserEntity } from 'src/app/database/entity/user.entity';
import { JwtPayload } from './strategies/jwt-access.strategy';
import { RegistrationDto } from './dto/registration-payload.dto';
import { LoginDto } from './dto/login-payload.dto';

export enum AuthServiceErrors {
  USER_ALREADY_EXISTS = 'User already exists',
  WRONG_PASSWORD = 'Wrong password',
}

@Injectable()
export class AuthService {
  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  @Inject(JwtService)
  private readonly _jwtService: JwtService;

  private createTokens(user: UserEntity): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = {
      id: user.id,
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

  async login(data: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this._userRepository.findByEmail(data.email, {
      select: ['id', 'password'],
    });

    if (!user || !(await user.passwordCompare(data.password)))
      throw new HttpException(
        AuthServiceErrors.WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );

    const tokens = this.createTokens(user);
    return tokens;
  }

  async register(data: RegistrationDto): Promise<void> {
    let user = await this._userRepository.findByEmail(data.email);

    if (user)
      throw new HttpException(
        AuthServiceErrors.USER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
      );

    user = this._userRepository.create({
      ...data,
    });

    await this._userRepository.save(user);
  }
}
