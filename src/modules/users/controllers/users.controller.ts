import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() user: CreateUserDto) {
    return await this.usersService.createUser(user);
  }

  @Get('getByEmail/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }
}
