import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersModel } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectQueue('queueUser') private queueUser: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  //Need just for git modifications 1
  //Need just for git modifications 2
  //Need just for git modifications 3
  //Need just for git modification 4
  async createUser(createUserDto: CreateUserDto): Promise<UsersModel> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw {
        statusCode: 400,
        message: 'ERR_USER_EMAIL_EXISTS',
      };
    }

    const user = this.usersRepository.create({ name, email, password });
    await this.usersRepository.save(user);

    await this.queueUser.add(
      {
        userId: user.id,
      },
      {
        delay: 10000,
      },
    );

    return user;
  }

  async findOne(
    id: number,
  ): Promise<
    UsersModel | { message: string; statusCode: number; user: { name: string } }
  > {
    const cachedData = await this.cacheManager.get<{ name: string }>(
      id.toString(),
    );

    if (cachedData) {
      return {
        statusCode: 200,
        message: 'SUCCESS',
        user: cachedData,
      };
    }

    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (user) {
      await this.cacheManager.set(id.toString(), user);
      return user;
    } else {
      throw new NotFoundException({
        statusCode: 400,
        message: 'ERR_USER_NOT_FOUND',
      });
    }
  }

  async getData() {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `https://45.196.48.9:5435`,
        auth: {
          username: 'jtzhwqur',
          password: 'jnf0t0n2tecg',
        },
      });

      return data;
    } catch (error) {
      throw new ForbiddenException(error);
    }
  }

  async update(
    id: number,
    updatedUserData: Partial<UsersModel>,
  ): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    await this.usersRepository.update(id, updatedUserData);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.query('delete from users_model where id = $1', [
      id,
    ]);
  }
}
