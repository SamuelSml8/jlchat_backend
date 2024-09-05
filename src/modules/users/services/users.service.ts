import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { createResponse } from 'src/shared/utils/response.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: CreateUserDto): Promise<ApiResponse<User>> {
    const userExists = await this.userModel
      .findOne({ email: user.email })
      .exec();

    if (userExists)
      throw new HttpException(
        createResponse(false, 'User already exists', null),
        HttpStatus.CONFLICT,
      );

    const newUser = new this.userModel(user);
    const createdUser = await newUser.save();
    return createResponse(true, 'User created successfully', createdUser);
  }

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

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user, { new: true })
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
}
