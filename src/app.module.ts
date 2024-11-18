import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { getDatabaseConfig } from './configs/database.config';
import { getRedisConfig } from './configs/redis.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    CacheModule.registerAsync({
      useFactory: getRedisConfig,
      isGlobal: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
