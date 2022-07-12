import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { config } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/post.module';
import { SubscriptionModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PostsModule,
    SubscriptionModule,
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
