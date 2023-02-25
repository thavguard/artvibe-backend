import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage, WsResponse, WebSocketGateway
} from '@nestjs/websockets';
import { Server } from 'ws';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessageAction } from './enums/message-actions.enum';

@WebSocketGateway({ namespace: '/chat' })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage(MessageAction.MsgToServer)
  public handleMessage(client: Socket, payload: any): Promise<WsResponse<any>> {
    return this.server.to(payload.room).emit(MessageAction.MsgToClient, payload);
  }

  @SubscribeMessage(MessageAction.JoinRoom)
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit(MessageAction.JoinedRoom, room);
  }

  @SubscribeMessage(MessageAction.LeaveRoom)
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit(MessageAction.LeftRoom);
  }

  public afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  public handleConnection(client: Socket, ...args): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }
}
