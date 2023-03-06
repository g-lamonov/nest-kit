import { Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export default class UserRepository extends Repository<UserEntity> {
  async findByEmail(
    email: string,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    const data = await this.findOne({
      where: {
        email,
      },
      ...options,
    });

    return data;
  }
}
