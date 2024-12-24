import { Controller, Get, Param } from '@nestjs/common';
import { WebSocketService } from './websocket.service';

@Controller('websocket')
export class WebSocketController {
  constructor(private readonly webSocketService: WebSocketService) {}

  @Get(':productId')
  async getTickerData(@Param('productId') productId: string): Promise<any> {
    return this.webSocketService.getTickerData(productId);
  }
}
