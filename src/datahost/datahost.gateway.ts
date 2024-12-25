import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataHostService } from './datahost.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Allow specific methods
  },
})
export class DataHostGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  private activeIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly dataHostService: DataHostService) {}

  afterInit() {
    console.log(
      'WebSocket server is initialized and ready to accept connections.',
    );
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`User ${userId} connected for data streaming`);

    // If an interval is already active for this client, clear it
    if (this.activeIntervals.has(client.id)) {
      clearInterval(this.activeIntervals.get(client.id));
      this.activeIntervals.delete(client.id);
    }

    // Start periodic streaming
    const interval = setInterval(async () => {
      await this.streamDataForUser(userId, client);
    }, 50); // Stream every 50m second

    // Save the interval reference to avoid duplicates
    this.activeIntervals.set(client.id, interval);

    // Handle client disconnection
    client.on('disconnect', () => {
      console.log(`Client ${client.id} disconnected`);
      clearInterval(this.activeIntervals.get(client.id));
      this.activeIntervals.delete(client.id);
    });
  }

  private async streamDataForUser(userId: string, client: Socket) {
    try {
      await this.dataHostService.streamDataForUser(userId, client);
    } catch (error) {
      console.error(`Error streaming data for user ${userId}:`, error.message);
      client.emit('error', {
        message: 'Error streaming data',
        details: error.message,
      });
    }
  }
}
