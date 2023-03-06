import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

export class UserRepository extends Repository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(
      userRepository.target,
      userRepository.manager,
      userRepository.queryRunner,
    );
  }

  async findById(
    id: string,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    const data = await this.findOne({
      where: {
        id,
      },
      ...options,
    });

    return data;
  }

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
