import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { User } from './users.entity';
import { Subscription } from 'src/subscriptions/subscriptions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription])],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}
