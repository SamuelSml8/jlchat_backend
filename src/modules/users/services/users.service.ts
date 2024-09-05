import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { createResponse } from 'src/shared/utils/response.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: CreateUserDto): Promise<ApiResponse<User>> {
    try {
      const userExists = await this.userModel
        .findOne({ email: user.email })
        .exec();

      if (userExists)
        throw new HttpException(
          createResponse(false, 'User already exists', null),
          HttpStatus.NOT_FOUND,
        );

      const newUser = new this.userModel(user);
      const createdUser = await newUser.save();
      return createResponse(true, 'User created successfully', createdUser);
    } catch (error) {
      throw new HttpException(
        createResponse(false, error.message, null),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
