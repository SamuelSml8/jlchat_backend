import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dtos';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { createResponse } from 'src/shared/utils/response.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    const userFound = await this.userModel.findOne({ email }).exec();

    if (!userFound) {
      throw new HttpException(
        createResponse(false, 'User not found', null),
        HttpStatus.NOT_FOUND,
      );
    }

    return createResponse(true, 'User found', userFound);
  }

  async updateUser(
    id: string,
    user: UpdateUserDto,
  ): Promise<ApiResponse<User>> {

    if (user.hasOwnProperty('role')) {
      throw new HttpException(
        createResponse(false, 'Cannot update role', null),
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateFields = { ...user };
    delete updateFields['role'];

    if (updateFields.email) {
      const existingUser = await this.userModel
        .findOne({ email: user.email })
        .exec();

      if (existingUser && existingUser.id !== id) {
        throw new HttpException(
          createResponse(false, 'Email already in use', null),
          HttpStatus.CONFLICT,
        );
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateFields, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException(
        createResponse(false, 'User not found', null),
        HttpStatus.NOT_FOUND,
      );
    }

    return createResponse(true, 'User updated successfully', updatedUser);
  }

  async deleteUser(id: string): Promise<ApiResponse<User>> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new HttpException(
        createResponse(false, 'User not found', null),
        HttpStatus.NOT_FOUND,
      );
    }

    return createResponse(true, 'User deleted successfully', deletedUser);
  }

  async updateRole(id: string, role: string): Promise<ApiResponse<User>> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { role }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException(
        createResponse(false, 'User not found', null),
        HttpStatus.NOT_FOUND,
      );
    }

    return createResponse(true, 'User role updated successfully', updatedUser);
  }
}
