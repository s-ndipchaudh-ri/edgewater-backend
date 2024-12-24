import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { WebSocketModule } from './websocket/websocket.module';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI_LOCAL),
    UserModule,
    AuthModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    mongoose.connection.on('connected', () => {
      console.log('DB connected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('DB connection error:', err);
    });
  }
}
