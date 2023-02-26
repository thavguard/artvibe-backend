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
import { ClientAction, ServerAction } from './enums/message-actions.enum';
import { MessageDto } from './dtos/message.dto';
import { UserService } from '../users/users.service';

@WebSocketGateway({ namespace: '/chat' })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService
  ) {
  }

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  @SubscribeMessage(ServerAction.MsgToServer)
  public async handleMessage(client: Socket, payload: MessageDto): Promise<WsResponse<any>> {
    return this.server.to(payload.roomId.toString()).emit(ClientAction.MsgToClient, payload);
  }

  @SubscribeMessage(ServerAction.JoinRoom)
  public joinRoom(client: Socket, roomId: number): void {
    client.join(roomId.toString());
    client.emit(ClientAction.JoinedRoom, roomId);
  }

  @SubscribeMessage(ServerAction.LeaveRoom)
  public leaveRoom(client: Socket, roomId: number): void {
    client.leave(roomId.toString());
    client.emit(ClientAction.LeftRoom);
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
