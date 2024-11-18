import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { QueueUser } from './processor/queue.user';
import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'queueUser',
      redis: {
        port: 6379,
      },
    }),
    CacheModule.register(),
  ],
  providers: [UserService, QueueUser],
  controllers: [UserController],
  exports: [UserService, QueueUser],
})
export class UsersModule {}
