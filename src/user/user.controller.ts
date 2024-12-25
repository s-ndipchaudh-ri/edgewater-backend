import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Apply the guard to all routes
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userDto: Partial<User>): Promise<User> {
    return this.userService.create(userDto);
  }

  // Get the user's data based on the token in the header
  @Get()
  async findUser(@Request() req): Promise<User> {
    const userId = req.user.userId; // Extract userId from the token payload
    return this.userService.findOne(userId); // Fetch user data by userId
  }

  @Get('all')
  async findAllUser(): Promise<User[]> {
    return this.userService.findAll(); // Fetch user data by userId
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Patch('pairs')
  async updatePairs(
    @Request() req,
    @Body() pairs: string[], // Expecting an array of pairs
  ): Promise<{ pairs: string[] }> {
    const userId = req.user.userId; // Extract userId from the token payload
    return this.userService.updatePairs(userId, pairs['pairs']); // Update pairs for the authenticated user
  }
}
