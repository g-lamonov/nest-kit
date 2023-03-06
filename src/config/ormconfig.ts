import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenv } from 'dotenv';
import { UserEntity } from 'src/app/database/entity/user.entity';

dotenv();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ssl: ['production', 'stage'].includes(process.env.NODE_ENV),
  url: process.env.DATABASE_URL,
  synchronize: true,
  // dropSchema: true,
  entities: [UserEntity],
};
