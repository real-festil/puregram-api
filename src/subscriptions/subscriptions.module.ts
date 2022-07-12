import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { SubscriptionController } from './subscriptions.controller';
import { Subscription } from './subscriptions.entity';
import { SubscriptionService } from './subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User])],
  exports: [SubscriptionService],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
