import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../schemas/user.schema';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse as ApiResponseDoc,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({
    name: 'email',
    type: String,
    description: 'Email of the user',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'User found successfully',
    type: User,
  })
  @ApiResponseDoc({ status: 404, description: 'User not found' })
  @Get('getByEmail/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<ApiResponse<User>> {
    return await this.usersService.getUserByEmail(email);
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to be updated',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Data to update the user',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponseDoc({ status: 404, description: 'User not found' })
  @Put('update/:id')
  async updateUser(
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<ApiResponse<User>> {
    return await this.usersService.updateUser(id, user);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'ID of the user to be deleted',
  })
  @ApiResponseDoc({
    status: 200,
    description: 'User deleted successfully',
    type: User,
  })
  @ApiResponseDoc({ status: 404, description: 'User not found' })
  @Delete('delete/:id')
  async deleteUser(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ApiResponse<User>> {
    return await this.usersService.deleteUser(id);
  }
}
