import { Logger, UnauthorizedException, UseGuards } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { AuthService } from "src/authentication/auth.service";
import { NotificationEntity } from "./entities/notification.entity";

@WebSocketGateway({ namespace: "notifications" })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly authService: AuthService) {}

  private clients = new Map<number, Socket>();
  private logger: Logger = new Logger("Notifications Gateway");

  async sendNotification(clientId: number, noti: NotificationEntity) {
    const client = this.getClientById(clientId);
    if (client) {
      client.emit("notifications", noti);
    }

    console.log("Клиент сейчас не в сети");

    return false;
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.headers?.authorization;

    console.log({ token });

    if (!token) {
      client.disconnect();
      return new UnauthorizedException();
    }

    const user = await this.authService.verify(token.replace("Bearer ", ""));

    if (!user) {
      console.log("Error");
    }

    this.clients.set(user.id, client);

    this.logger.log(`User with id ${user.id} has been connected`);
  }

  async handleDisconnect(client: Socket) {
    const token = client.handshake.headers?.authorization;

    const user = await this.authService.verify(token.replace("Bearer ", ""));

    this.clients.delete(user.id);

    this.logger.log(`User with id ${user.id} has been disconnected`);
  }

  afterInit(server: Socket) {}

  private getClientById(userId: number): Socket {
    return this.clients.get(userId);
  }
}
