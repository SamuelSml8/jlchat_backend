import { InjectModel } from '@nestjs/mongoose';
import { Chat } from '../schemas/chat.schema';
import { Message } from '../schemas/message.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { AddFriendDto } from '../dtos/add-friend.dto';
import { ApiResponse } from 'src/shared/interfaces/response.interface';
import { createResponse } from 'src/shared/utils/response.util';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addFriend(addFriend: AddFriendDto): Promise<ApiResponse<Chat>> {
    const chatFound = await this.chatModel
      .findOne({
        members: { $all: [addFriend.userId, addFriend.friendId] },
        isGroup: false,
      })
      .exec();

    if (!chatFound) {
      const chat = new this.chatModel({
        name: 'Private chat',
        members: [addFriend.userId, addFriend.friendId],
        isGroup: false,
      });
      await chat.save();

      await this.userModel.findByIdAndUpdate(addFriend.userId, {
        $push: { friends: chat._id },
      });
      await this.userModel.findByIdAndUpdate(addFriend.friendId, {
        $push: { friends: chat._id },
      });

      await this.userModel.findByIdAndUpdate(addFriend.userId, {
        $addToSet: { friends: addFriend.friendId },
      });
      await this.userModel.findByIdAndUpdate(addFriend.friendId, {
        $addToSet: { friends: addFriend.userId },
      });

      return createResponse(true, 'Friend added successfully', null);
    }

    throw new HttpException(
      createResponse(false, 'Friend already added', null),
      HttpStatus.BAD_REQUEST,
    );
  }

  async createGroup(
    createGroup: CreateGroupDto,
    adminGroup: string,
  ): Promise<Chat> {
    const group = new this.chatModel({
      name: createGroup.name,
      members: [createGroup.members, adminGroup],
      isGroup: true,
    });

    return group.save();
  }

  async sendMessage(
    chatId: string,
    senderId: string,
    content: string,
  ): Promise<Message> {
    const message = new this.messageModel({
      chatId,
      sender: senderId,
      content,
    });

    return message.save();
  }

  async getMessagesByChat(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chatId }).exec();
  }

  async addMemberToGroup(chatId: string, memberId: string): Promise<Chat> {
    return this.chatModel
      .findByIdAndUpdate(
        chatId,
        { $addToSet: { members: memberId } },
        { new: true },
      )
      .exec();
  }

  async getChatsByUserId(userId: string): Promise<Chat[]> {
    return this.chatModel.find({ members: userId }).populate('members').exec();
  }
}
