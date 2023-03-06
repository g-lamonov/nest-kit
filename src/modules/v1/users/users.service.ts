import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/database/entity/user.entity';
import { UserRepository } from 'src/database/repositories/user.repository';

@Injectable()
export class UsersService {
  @Inject(UserRepository)
  private readonly _userRepository: UserRepository;

  async profile(id: string): Promise<UserEntity> {
    const user = await this._userRepository.findById(id);
    return user;
  }
}
