import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersModel } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getQueueToken } from '@nestjs/bull';

const userRepositoryMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const queueUserMock = {
  add: jest.fn(),
};

const cacheManagerMock = {
  get: jest.fn(),
  set: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UsersModel),
          useValue: userRepositoryMock,
        },
        {
          provide: getQueueToken,
          useValue: queueUserMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create e new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'qwerty',
      email: 'qwerty@gmail.com',
      password: 'qwerty',
    };

    userRepositoryMock.findOne.mockResolvedValue(undefined);

    const savedUser: UsersModel = Object.assign(new UsersModel(), {
      id: 1,
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      status: false,
    });

    userRepositoryMock.create.mockReturnValue(savedUser);
    userRepositoryMock.save.mockResolvedValue(savedUser);

    const resultUser = await service.createUser(createUserDto);

    expect(userRepositoryMock.create).toHaveBeenCalledWith(createUserDto);
    expect(userRepositoryMock.save).toHaveBeenCalledWith(createUserDto);
    expect(queueUserMock.add).toHaveBeenCalledWith(
      {
        userId: savedUser.id,
      },
      {
        delay: 10000,
      },
    );

    return expect(resultUser).toEqual(createUserDto);
  });
});
