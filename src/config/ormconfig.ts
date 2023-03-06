import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenv } from 'dotenv';

dotenv();

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  ssl: ['production', 'stage'].includes(process.env.NODE_ENV),
  url: process.env.DATABASE_URL,
  synchronize: true,
};
