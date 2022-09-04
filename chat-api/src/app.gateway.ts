import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(0, { namespace: 'auction' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private users = {}; // Redis
  private logger: Logger = new Logger('AppGateway');

  // @SubscribeMessage('msgToServer')
  // handleMessage(client: Socket, payload: string): void {
  //   this.server.emit('msgToClient', payload, client.id);
  // }

  @SubscribeMessage('join')
  joinAuction(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { name: string; auction_id: string; bid: string },
  ): void {
    const { name, auction_id } = body;
    this.users[client.id] = { name, auction_id };
    client.join(auction_id);
    console.log('join', client.id, body);
  }

  @SubscribeMessage('send-message')
  sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { message: string; bid: string },
  ): void {
    const { name, auction_id } = this.users[client.id];
    body.bid = `${name} deu um lance de R$ ${body.message}`;
    // console.log(bid);
    client.broadcast.to(auction_id).emit('receive-message', { ...body, name });
    // client.broadcast.to(auction_id).emit('receive-message', { ...body, name });
    console.log(body);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    //   const { name } = client.handshake.query;
    //   this.users[client.id] = { name };
    //   this.logger.log(`Client connected: ${client.id}`);
    //   console.log(this.users);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
