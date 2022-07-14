import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Post } from './posts.entity';
import admin from 'firebase-admin';
import { uuid } from 'uuidv4';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private userService: UserService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async getPosts() {
    let res = await this.postsRepository.find();
    res = await Promise.all(
      res.map(async (post) => {
        const user = await this.userService.getSingleUser(post.userId);
        return { ...post, username: user.username, avatarUrl: user.avatarUrl };
      }),
    );
    return res.sort(
      (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
    );
  }

  async getSinglePost(postId: string) {
    return await this.postsRepository.findOne(postId);
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
      likesCount: 69,
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
    const userPosts = await this.postsRepository.find({
      where: { userId: userId },
    });
    return userPosts.map((post) => ({ ...post, username: user.username }));
  }
}
