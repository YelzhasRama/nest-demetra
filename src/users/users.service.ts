import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './users.model';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: UsersRepository,
  ) {}

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

    return user;
  }

  async findOne(
    id: number,
  ): Promise<UsersModel | { statusCode: number; message: string }> {
    const user = this.usersRepository.findOne({
      where: { id },
    });

    if (user) {
      return user;
    } else {
      throw new NotFoundException({
        statusCode: 400,
        message: 'ERR_USER_NOT_FOUND',
      });
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
