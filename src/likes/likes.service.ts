/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';

@Injectable({ scope: Scope.REQUEST })
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async likePost(postId: string) {
    //@ts-ignore
    const userId = this.request.user.id;
    const isPostLikedByUser = await this.likeRepository.findOne({
      postId,
      userId,
    });

    if (!isPostLikedByUser) {
      return await this.likeRepository.save({ postId, userId });
    } else {
      return await this.likeRepository.delete({ postId, userId });
    }
  }
}
