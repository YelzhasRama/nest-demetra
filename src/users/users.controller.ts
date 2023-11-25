import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersModel } from './users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('get-user-by-id/:id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Put()
  updateUser(
    @Param('id') id: number,
    @Body() updatedUserData: Partial<UsersModel>,
  ) {
    return this.usersService.update(+id, updatedUserData);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(+id);
  }
}
