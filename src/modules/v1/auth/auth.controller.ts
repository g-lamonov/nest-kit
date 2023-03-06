import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-payload.dto';
import { RegistrationDto } from './dto/registration-payload.dto';

@ApiTags('v1', 'auth')
@Controller('v1/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly _service: AuthService;

  @Post('sign-in')
  @ApiOperation({
    description: 'Login',
  })
  async login(@Body() user: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
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
}
