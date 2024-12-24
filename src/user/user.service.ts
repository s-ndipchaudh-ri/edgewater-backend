import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Create a new user
  async create(userDto: Partial<User>): Promise<User> {
    const newUser = new this.userModel(userDto);
    return newUser.save();
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Find a user by ID
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Update a user by ID
  async update(id: string, userDto: Partial<User>): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
  }

  // Delete a user by ID
  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async updatePairs(
    userId: string,
    pairs: string[],
  ): Promise<{ pairs: string[] }> {
    pairs = pairs;

    if (!Array.isArray(pairs)) {
      throw new HttpException('Pairs must be an array', HttpStatus.BAD_REQUEST);
    }
    console.log(userId);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { pairs }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      pairs: updatedUser.pairs,
    };
  }
}
