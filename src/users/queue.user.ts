import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './users.model';
import { Repository } from 'typeorm';

@Processor('queueUser')
export class QueueUser {
  constructor(
    @InjectRepository(UsersModel)
    private userRepository: Repository<UsersModel>,
  ) {}

  @Process()
  async handle(job: Job<{ userId: number }>) {
    const user = await this.userRepository.findOne({
      where: { id: job.data.userId },
    });
    if (user) {
      user.status = true;
      await this.userRepository.save(user);
    }
  }
}
