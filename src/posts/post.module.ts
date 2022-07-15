import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from 'src/likes/likes.entity';
import { UsersModule } from 'src/users/users.module';
import { PostController } from './posts.controller';
import { Post } from './posts.entity';
import { PostService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like]), UsersModule],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostsModule {}
