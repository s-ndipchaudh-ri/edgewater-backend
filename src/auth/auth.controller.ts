import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../user/schemas/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: Partial<User>): Promise<{
    _id: any;
    username: string;
    access_token: string;
    pairs: string[];
  }> {
    try {
      return await this.authService.register(body);
    } catch (error) {
      throw new HttpException({ ...error }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    try {
      const user = await this.authService.validateUser(
        body.username,
        body.password,
      );
      if (!user) {
        throw new HttpException(
          'Invalid username or password',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return this.authService.login(user);
    } catch (error) {
      throw new HttpException({ ...error }, HttpStatus.UNAUTHORIZED);
    }
  }
}
