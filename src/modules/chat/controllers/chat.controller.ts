import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ChatService } from '../services/chat.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse as ApiResponseDoc,
  ApiTags,
} from '@nestjs/swagger';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { AddFriendDto } from '../dtos/add-friend.dto';
import { MongoIdValidationPipe } from 'src/common/pipes/mongo-id-validation.pipe';

@ApiTags('Chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('user-chats')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all user chats' })
  @ApiResponseDoc({ status: 200, description: 'Get all user chats' })
  @ApiResponseDoc({ status: 401, description: 'Unauthorized' })
  @ApiResponseDoc({ status: 403, description: 'Forbidden' })
  @ApiResponseDoc({ status: 500, description: 'Internal Server Error' })
  async getAllUserChats(@Req() request: FastifyRequest) {
    const user = request['user'];
    return this.chatService.getChatsByUserId(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('chat-messages/:chatId')
  @ApiOperation({ summary: 'Get chat messages' })
  @ApiResponseDoc({ status: 200, description: 'Get chat messages' })
  @ApiResponseDoc({ status: 401, description: 'Unauthorized' })
  @ApiResponseDoc({ status: 403, description: 'Forbidden' })
  @ApiResponseDoc({ status: 500, description: 'Internal Server Error' })
  async getChatMessages(
    @Param('chatId', MongoIdValidationPipe) chatId: string,
  ) {
    return this.chatService.getMessagesByChat(chatId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('create-group')
  async createGroup(
    @Body() createGroup: CreateGroupDto,
    @Req() request: FastifyRequest,
  ) {
    const adminGroup = request['user'];
    return this.chatService.createGroup(createGroup, adminGroup.sub);
  }

  @Post('add-friend')
  async addFriend(@Body() addFriend: AddFriendDto) {
    return this.chatService.addFriend(addFriend);
  }
}
