import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Register a new user
  async register(userDto: Partial<User>): Promise<User> {
    // Check if the email already exists
    const existingUser = await this.userModel
      .findOne({ email: userDto.email })
      .exec();
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userDto.password, 10);

    // Save the user
    const user = new this.userModel({ ...userDto, password: hashedPassword });
    return user.save();
  }

  // Validate user for login
  async validateUser(username: string, password: string): Promise<User> {
    try {
      // Find user by username
      const user = await this.userModel.findOne({ username }).exec();

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // Compare the provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      return user;
    } catch (error) {
      console.error('Error in validateUser:', error.message);
      throw new HttpException(
        error.message || 'Validation error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Generate JWT token
  async login(userDto: {
    _id: any;
    username: any;
  }): Promise<{ _id: string; username: string; access_token: string }> {
    try {
      // Validate user credentials
      const user = userDto;
      // Generate JWT token
      const payload = { username: user.username, sub: user._id };
      const accessToken = this.jwtService.sign(payload);
      return {
        _id: user._id,
        username: user.username,
        access_token: accessToken,
      };
    } catch (error) {
      console.error('Error in login:', error.message);
      throw new HttpException(
        error.message || 'Login error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
