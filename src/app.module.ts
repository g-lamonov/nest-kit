import { Module } from '@nestjs/common';
import { V1Module } from 'src/modules/v1/v1.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, V1Module],
})
export class AppModule {}
