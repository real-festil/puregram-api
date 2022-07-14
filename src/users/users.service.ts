/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './users.dto';
import { Subscription } from 'src/subscriptions/subscriptions.entity';
import { REQUEST } from '@nestjs/core';
import admin from 'firebase-admin';
import { Request } from 'express';
import { uuid } from 'uuidv4';

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
      avatarUrl:
        'https://i.pinimg.com/474x/3f/de/86/3fde8620893d9a399a8f9214c76cdc9a.jpg',
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

  async updateUserAvatar(image) {
    if (!this.request.user) {
      return null;
    }
    //@ts-ignore
    const user = await this.usersRepository.findOne(this.request.user.id);
    const url = await this.uploadFile(image);
    return await this.usersRepository.save({
      ...user,
      avatarUrl: url,
    });
  }

  async uploadFile(file) {
    const bucket = admin.storage().bucket();
    console.log('file', file);

    const filename = uuid() + file.originalname;

    // Uploads a local file to the bucket
    await bucket
      .file(filename)
      .save(file.buffer)
      .then((res) => console.log(res));
    const bucketFile = bucket.file(filename);

    const urls = await bucketFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    console.log(`${filename} uploaded.`);

    return urls[0];
  }
}
