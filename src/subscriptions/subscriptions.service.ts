import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Subscription } from './subscriptions.entity';
import { Request } from 'express';
import { User } from 'src/users/users.entity';

@Injectable({ scope: Scope.REQUEST })
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<Subscription>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async subscribeToUser(userId: string) {
    return await this.subscriptionRepository.save({
      userId: userId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      subscribedUserId: this.request.user.id,
    });
  }

  async unsubscribeFromUser(userId: string) {
    return await this.subscriptionRepository.delete({
      userId,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      subscribedUserId: this.request.user.id,
    });
  }

  async getUserSubscribers(userId: string) {
    const userSubscribers = await this.subscriptionRepository.find({
      where: { userId: userId },
    });
    const res = await Promise.all(
      userSubscribers.map(async (subscription) => {
        const user = await this.getSingleUser(subscription.subscribedUserId);
        user['password'] = null;
        return { ...subscription, user: user };
      }),
    );
    return res;
  }

  async getUsersBySubscriberId(userId: string) {
    const userSubscribers = await this.subscriptionRepository.find({
      where: { subscribedUserId: userId },
    });
    const res = await Promise.all(
      userSubscribers.map(async (subscription) => {
        const user = await this.getSingleUser(subscription.userId);
        user['password'] = null;
        return { ...subscription, user: user };
      }),
    );
    return res;
  }

  async getSingleUser(userId: string) {
    return await this.userRepository.findOne(userId);
  }
}
