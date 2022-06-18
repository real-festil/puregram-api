import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './users.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addUser(
    username: string,
    email: string,
    password: string,
    appleId?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 8);
    const res = await this.usersRepository.save({
      username,
      email,
      password: hashedPassword,
      appleId,
      isVerified: false,
    });
    return res;
  }

  async getUsers() {
    return await this.usersRepository.find();
  }

  async getSingleUser(userId: string) {
    return await this.usersRepository.findOne(userId);
  }

  async updateUser(
    userId: string,
    userData: UpdateUserDto,
    isHashed?: boolean,
  ) {
    const user = await this.usersRepository.findOne(userId);
    const hashedPassword = await bcrypt.hash(userData.password, 8);
    const updatedUserData = {
      ...userData,
      password: isHashed ? userData.password : hashedPassword,
    };
    return await this.usersRepository.save({
      ...user,
      ...updatedUserData,
    });
  }

  async deleteUser(userId: string) {
    this.usersRepository.delete({ id: userId });
    return userId;
  }
}
