import { Module } from '@nestjs/common';
import { ChatService } from './services/chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ChatController } from './controllers/chat.controller';
import { JwtService } from '@nestjs/jwt';
import { BlackListService } from '../auth/services/black-list.service';
import { BlackList, BlackListSchema } from '../auth/schemas/black-list.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
      { name: BlackList.name, schema: BlackListSchema },
    ]),
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, JwtService, BlackListService],
})
export class ChatModule {}
