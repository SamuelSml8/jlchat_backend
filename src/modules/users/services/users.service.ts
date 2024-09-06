import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from '../dtos';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { createResponse } from 'src/shared/utils/response.util';
import { AddFriendDto } from '../dtos/add-friend.dto';

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

  async findByName(name: string): Promise<ApiResponse<User[]>> {
    const users = await this.userModel
      .find({ name: { $regex: name, $options: 'i' } })
      .exec();

    if (!users || users.length === 0) {
      throw new HttpException(
        createResponse(false, 'Users not found', null),
        HttpStatus.NOT_FOUND,
      );
    }

    return createResponse(true, 'Users found', users);
  }

  async addFriend(addFriend: AddFriendDto): Promise<ApiResponse<User>> {
    const { userId, friendId } = addFriend;

    const user = await this.userModel.findById(userId).exec();
    const friend = await this.userModel.findById(friendId).exec();

    if (!user || !friend) {
      throw new HttpException(
        createResponse(false, 'User not found', null),
        HttpStatus.NOT_FOUND,
      );
    }

    const isFriend = user.friends.includes(friendId);
    if (isFriend) {
      throw new HttpException(
        createResponse(false, 'User is already a friend', null),
        HttpStatus.CONFLICT,
      );
    }

    user.friends.push(friendId);
    await user.save();
    return createResponse(true, 'Friend added successfully', user);
  }
}
