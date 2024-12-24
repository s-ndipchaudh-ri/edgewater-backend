import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';
import * as WebSocket from 'ws';

@Injectable()
export class WebSocketService implements OnModuleInit, OnModuleDestroy {
  private redisClient;
  private ws: WebSocket;

  async onModuleInit() {
    // Initialize Redis client
    this.redisClient = createClient({ url: 'redis://localhost:6379' });
    this.redisClient.on('connect', () => console.log('Connected to Redis'));
    this.redisClient.on('error', (err) => console.error('Redis error:', err));
    await this.redisClient.connect();

    // Initialize WebSocket
    this.ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
    this.ws.on('open', this.onWebSocketOpen.bind(this));
    this.ws.on('message', this.onWebSocketMessage.bind(this));
    this.ws.on('error', this.onWebSocketError.bind(this));
    this.ws.on('close', this.onWebSocketClose.bind(this));
  }

  async onModuleDestroy() {
    // Cleanup Redis client and WebSocket
    await this.redisClient.quit();
    this.ws.close();
  }

  private onWebSocketOpen() {
    console.log('Connected to Coinbase WebSocket');
    const subscribeMessage = {
      type: 'subscribe',
      channels: [
        {
          name: 'ticker',
          product_ids: ['BTC-USD', 'ETH-USD', 'XRP-USD', 'LTC-USD'],
        },
      ],
    };
    this.ws.send(JSON.stringify(subscribeMessage));
  }

  private async onWebSocketMessage(data: WebSocket.Data) {
    try {
      const message = JSON.parse(data.toString());
      if (message.type === 'ticker') {
        const key = `${message.product_id}`;
        const value = JSON.stringify({ ...message });

        await this.redisClient.set(key, value);
      }
    } catch (err) {
      console.error('Error processing WebSocket message:', err);
    }
  }

  private onWebSocketError(err: WebSocket.ErrorEvent) {
    console.error('WebSocket error:', err.message);
  }

  private onWebSocketClose() {
    console.log('WebSocket connection closed');
  }

  // Expose a method to get data from Redis
  async getTickerData(productId: string): Promise<any> {
    const key = `ticker:${productId}`;
    const value = await this.redisClient.get(key);
    if (!value) {
      return { message: 'No data found for the given product ID' };
    }
    return JSON.parse(value);
  }
}
