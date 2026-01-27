import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateLocation')
  handleLocationUpdate(client: Socket, payload: any) {
    this.logger.log(`Location update from ${client.id}:`, payload);
    // Broadcast to all clients
    this.server.emit('locationUpdate', payload);
  }

  // Method to send notifications
  sendNotification(userId: string, notification: any) {
    this.server.emit('notification', { userId, ...notification });
  }

  // Method to send order updates
  sendOrderUpdate(orderId: string, update: any) {
    this.server.emit('orderUpdate', { orderId, ...update });
  }
}
