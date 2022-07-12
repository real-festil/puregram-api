import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @ApiTags('Subscriptions')
  @ApiOperation({ summary: 'Subscribe to user' })
  @Post(':id')
  async subscribeToUser(@Param('id') userId: string) {
    return await this.subscriptionService.subscribeToUser(userId);
  }

  @ApiTags('Subscriptions')
  @ApiOperation({ summary: 'Get subscriptions by user' })
  @Get('user/:userId')
  async getUserSubscribers(@Param('userId') userId: string) {
    return await this.subscriptionService.getUserSubscribers(userId);
  }

  @ApiTags('Subscriptions')
  @ApiOperation({ summary: 'Get users by subscription' })
  @Get('subscription/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    return await this.subscriptionService.getUsersBySubscriberId(userId);
  }
}
