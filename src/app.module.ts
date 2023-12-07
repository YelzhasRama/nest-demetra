import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModel } from './users/users.model';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'dpg-clokg6p46foc73a1ddog-a',
      port: 5432,
      username: 'demetra_user',
      password: 'SUEAZ4H2rFXiwuS5QjkZby3f6cVsnFoj',
      database: 'demetra',
      entities: [UsersModel],
      synchronize: true,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'red-cloki4h46foc73a1dqr0',
      port: 6379,
      ttl: 10,
      max: 10,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
