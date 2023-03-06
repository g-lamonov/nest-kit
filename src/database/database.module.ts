import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from '../config/ormconfig';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(ormConfig)],
})
export class DatabaseModule {}
