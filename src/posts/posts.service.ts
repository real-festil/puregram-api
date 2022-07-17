/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import admin from 'firebase-admin';
import { uuid } from 'uuidv4';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Like } from 'src/likes/likes.entity';
import { Comment } from 'src/comments/comments.entity';
import { User } from 'src/users/users.entity';

@Injectable({ scope: Scope.REQUEST })
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getPosts(cursor: number) {
    let [res] = await this.postsRepository.findAndCount({
      order: { created_at: 'DESC' },
      take: 5,
      skip: cursor,
    });
    res = await Promise.all(
      res.map(async (post) => {
        const user = await this.userService.getSingleUser(post.userId);
        const likesCount = await this.likesRepository.findAndCount({
          postId: post.id,
        });
        const isPostLikedByUser = await this.likesRepository.findOne({
          postId: post.id,
          //@ts-ignore
          userId: this.request.user.id,
        });
        const commentsCount = await this.commentsRepository.findAndCount({
          postId: post.id,
        });
        return {
          ...post,
          username: user.username,
          avatarUrl: user.avatarUrl,
          likesCount: likesCount[1],
          isPostLikedByUser: !!isPostLikedByUser,
          commentsCount: commentsCount[1],
        };
      }),
    );
    return res;
  }

  async getSinglePost(postId: string) {
    const post = await this.postsRepository.findOne(postId);
    const user = await this.userService.getSingleUser(post.userId);
    const likesCount = await this.likesRepository.findAndCount({
      postId,
    });
    const isPostLikedByUser = await this.likesRepository.find({
      postId,
      //@ts-ignore
      userId: this.request.user.id,
    });
    const commentsCount = await this.commentsRepository.findAndCount({
      postId,
    });
    return {
      ...post,
      username: user.username,
      avatarUrl: user.avatarUrl,
      likesCount: likesCount[1],
      isPostLikedByUser: !!isPostLikedByUser,
      commentsCount: commentsCount[1],
    };
  }

  async addPost(image: Express.Multer.File, label: string) {
    if (!this.request.user) {
      return null;
    }
    console.log('request', this.request.user);
    const url = await this.uploadFile(image);
    return await this.postsRepository.save({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      userId: this.request.user.id,
      imageUrl: url,
      label: label,
      likesCount: 0,
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

  async deletePost(postId: string) {
    this.postsRepository.delete({ id: postId });
    return postId;
  }

  async getPostsByUser(userId: string) {
    const user = await this.userService.getSingleUser(userId);
    let userPosts = await this.postsRepository.find({
      where: { userId: userId },
    });
    userPosts = await Promise.all(
      userPosts.map(async (post) => {
        const likesCount = await this.likesRepository.findAndCount({
          postId: post.id,
        });
        const isPostLikedByUser = await this.likesRepository.findOne({
          postId: post.id,
          //@ts-ignore
          userId: this.request.user.id,
        });
        console.log('isPostLikedByUser', isPostLikedByUser);
        return {
          ...post,
          username: user.username,
          avatarUrl: user.avatarUrl,
          likesCount: likesCount[1],
          isPostLikedByUser: !!isPostLikedByUser,
        };
      }),
    );
    return userPosts.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  }

  async getPostComments(postId: string) {
    let comments = await this.commentsRepository.find({ postId });

    comments = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.usersRepository.findOne({
          id: comment.userId,
        });
        return {
          ...comment,
          username: user.username,
          avatarUrl: user.avatarUrl,
        };
      }),
    );
    return comments.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  }
}
