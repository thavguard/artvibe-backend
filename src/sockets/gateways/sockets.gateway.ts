import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "https";

@WebSocketGateway()
export class SocketsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    public server: Server

    handleConnection(client: any, ...args: any[]) {

    }

    handleDisconnect(client: any) {

    }
}
