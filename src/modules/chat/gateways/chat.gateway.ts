import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatService } from '../services/chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: { chatId: string; message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatId, message, sender } = payload;
    const savedMessage = await this.chatService.sendMessage(
      chatId,
      sender,
      message,
    );

    this.server.to(chatId).emit('receiveMessage', savedMessage);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(chatId);
    this.server.to(chatId).emit('userJoined', { userId: client.id });
  }
}
