import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenv } from 'dotenv';
import { UserEntity } from 'src/database/entity/user.entity';

dotenv();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ssl: ['production', 'stage'].includes(process.env.NODE_ENV),
  url:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URL
      : process.env.MAIN_DATABASE_URL,
  synchronize: true,
  entities: [UserEntity],
};
