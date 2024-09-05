import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dtos';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../schemas/user.schema';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse as ApiResponseDoc,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

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
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
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
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async deleteUser(
    @Param('id', MongoIdValidationPipe) id: string,
  ): Promise<ApiResponse<User>> {
    return await this.usersService.deleteUser(id);
  }
}
