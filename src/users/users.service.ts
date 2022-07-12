/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './users.dto';
import { Subscription } from 'src/subscriptions/subscriptions.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @Inject(REQUEST) private readonly request: Request,
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
    const user = await this.usersRepository.findOne(userId);
    const userSubscribersCount = await this.getUserSubscribersCount(userId);
    const usersBySubscribersIdCount = await this.getUsersBySubscriberIdCount(
      userId,
    );
    //@ts-ignore
    if (userId !== this.request.user.id) {
      const isSubscribed = await this.getIsUserSubscribed(
        userId,
        //@ts-ignore
        this.request.user.id,
      );
      return {
        ...user,
        subscriberCount: userSubscribersCount,
        subscribedCount: usersBySubscribersIdCount,
        isSubscribed: !!isSubscribed,
      };
    }
    return {
      ...user,
      subscriberCount: userSubscribersCount,
      subscribedCount: usersBySubscribersIdCount,
    };
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

  async getUserSubscribersCount(userId: string) {
    return await this.subscriptionRepository.count({
      where: { userId: userId },
    });
  }

  async getUsersBySubscriberIdCount(userId: string) {
    return await this.subscriptionRepository.count({
      where: { subscribedUserId: userId },
    });
  }

  async getIsUserSubscribed(userId: string, subscribedUserId: string) {
    return await this.subscriptionRepository.findOne({
      where: { userId: userId, subscribedUserId: subscribedUserId },
    });
  }
}
