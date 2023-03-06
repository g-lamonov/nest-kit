import {
  Body,
  Controller,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtTokensDto } from './dto/jwt-tokens.dto';
import { LoginDto } from './dto/login-payload.dto';
import { RegistrationDto } from './dto/registration-payload.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RequestContext } from './interfaces/request-context.interface';

@ApiTags('v1', 'auth')
@Controller('v1/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly _service: AuthService;

  @Post('sign-in')
  @ApiOperation({
    description: 'Login',
  })
  async login(@Body() user: LoginDto): Promise<JwtTokensDto> {
    const data = await this._service.login(user);
    return data;
  }

  @Post('sign-up')
  @ApiOperation({
    description: 'Registration',
  })
  async register(@Body() registrationDto: RegistrationDto): Promise<void> {
    await this._service.register(registrationDto);
  }

  @Post('token/refresh')
  @ApiOperation({
    description: 'Refresh token',
  })
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refreshToken(
    @Request() request: RequestContext,
  ): Promise<JwtTokensDto> {
    const tokens = await this._service.refreshToken(request.user.id);
    return tokens;
  }
}
