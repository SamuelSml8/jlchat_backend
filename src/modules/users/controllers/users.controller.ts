import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../schemas/user.schema';

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

  @Put('update/:id')
  async updateUser(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    return await this.usersService.updateUser(id, user);
  }
}
