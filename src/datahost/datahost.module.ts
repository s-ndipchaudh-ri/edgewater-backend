import { Module } from '@nestjs/common';
import { DataHostService } from './datahost.service';
import { DataHostGateway } from './datahost.gateway';
import { UserModule } from '../user/user.module'; // Import UserModule
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [UserModule, WebSocketModule], // Add UserModule here
  providers: [DataHostService, DataHostGateway],
})
export class DataHostModule {}
