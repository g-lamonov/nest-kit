import { Controller, Get, Inject, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/database/entity/user.entity';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { UsersService } from './users.service';

@ApiTags('v1', 'users')
@Controller('v1/users')
export class UsersController {
  @Inject(UsersService)
  private readonly _service: UsersService;

  @UseGuards(JwtAccessGuard)
  @Get('profile')
  @ApiOperation({
    description: 'Get profile',
  })
  @ApiBearerAuth()
  async profile(@Request() req): Promise<UserEntity> {
    const user = <UserEntity>req.user;

    const profile = await this._service.profile(user.id);
    return profile;
  }
}
