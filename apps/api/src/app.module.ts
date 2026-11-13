import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // .env лежить у корені репозиторію; і src/, і dist/ на три рівні нижче.
      envFilePath: resolve(import.meta.dirname, '../../../.env'),
    }),
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
