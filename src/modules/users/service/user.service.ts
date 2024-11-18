import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import axios from 'axios';
import { getProxyConfig } from '../../../configs/proxy.config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectQueue('queueUser') private queueUser: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
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
    UserEntity | { message: string; statusCode: number; user: { name: string } }
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

  axiosInstance = axios.create({
    baseURL: 'http://',
    proxy: getProxyConfig(),
  });

  makeRequestWithProxy = async () => {
    try {
      const response = await this.axiosInstance.get('/');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error with request:', error);
      throw error;
    }
  };
}
