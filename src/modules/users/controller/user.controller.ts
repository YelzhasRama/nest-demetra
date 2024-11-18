import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('get-user-by-id/:id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
