import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { WebSocketService } from '../websocket/websocket.service';
import { createClient } from 'redis';
import { Socket } from 'socket.io';

@Injectable()
export class DataHostService {
  private redisClient;

  constructor(
    private readonly userService: UserService, // Ensure UserService is injected
    private readonly webSocketService: WebSocketService,
  ) {
    this.redisClient = createClient({ url: 'redis://localhost:6379' });
    this.redisClient.connect();
  }

  async streamDataForUser(userId: any, client: Socket) {
    const user = await this.userService.findOne(userId.data); // Use UserService
    if (!user || !user.pairs.length) {
      client.emit(
        'Error',
        JSON.stringify({ message: 'No pairs found for this user' }),
      );
      return;
    }

    client.emit(JSON.stringify({ message: 'No pairs found for this user' }));
    if (user.pairs.length == 0) {
      client.emit(
        'data',
        JSON.stringify({
          pair: 'pair',
          allPairs: user.pairs,
          data: {},
        }),
      );
    }
    for (const pair of user.pairs) {
      const key = `${pair}`;
      const value = await this.redisClient.get(key);
      if (value) {
        client.emit(
          'data',
          JSON.stringify({
            pair,
            allPairs: user.pairs,
            data: JSON.parse(value),
          }),
        );
      }
    }
  }
}
