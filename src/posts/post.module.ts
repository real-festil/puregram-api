import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/comments/comments.entity';
import { Like } from 'src/likes/likes.entity';
import { User } from 'src/users/users.entity';
import { UsersModule } from 'src/users/users.module';
import { PostController } from './posts.controller';
import { Post } from './posts.entity';
import { PostService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Comment, User]), UsersModule],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostsModule {}
