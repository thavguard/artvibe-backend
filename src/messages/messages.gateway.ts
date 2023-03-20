import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { AuthService } from '../authentication/auth.service';
import { UserService } from '../users/users.service';
import { MessageDto } from './dtos/message.dto';
import { ClientAction, ServerAction } from './enums/message-actions.enum';
import { MessagesService } from './messages.service';

@WebSocketGateway({ namespace: '/chat' })
export class MessagesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly messageService: MessagesService
  ) {
  }

  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessagesGateway');

  @SubscribeMessage(ServerAction.MsgToServer)
  public async handleMessage(client: Socket, payload: MessageDto): Promise<boolean> {

    const jwtPayload = await this.authService.verify(
      client.handshake.headers.authorization
    );

    const userId = jwtPayload.sub;

    await this.messageService.saveMessage(userId, payload.roomId, { message: payload.body });


    return client.to(payload.roomId?.toString()).emit(ClientAction.MsgToClient, { ...payload, userId });

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

  public handleConnection(client: Socket, ...args): void {
    return this.logger.log(`Client connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }




}
