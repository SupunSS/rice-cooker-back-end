
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway()
  export class NotificationsGateway {
    @WebSocketServer() server: Server;
  
    @SubscribeMessage('send-command')
    handleCommand(@MessageBody() data: any) {
      console.log('Command Received:', data);
      this.server.emit('command', data);
    }
  }