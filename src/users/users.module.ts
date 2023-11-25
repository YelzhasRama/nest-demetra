import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './users.model';
import { QueueUser } from './queue.user';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]),
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
  ],
  providers: [UsersService, QueueUser],
  controllers: [UsersController],
  exports: [UsersService, QueueUser],
})
export class UsersModule {}
