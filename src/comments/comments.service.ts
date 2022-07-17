/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';

@Injectable({ scope: Scope.REQUEST })
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async addComment(postId: string, commentText: string) {
    //@ts-ignore
    const userId = this.request.user.id;

    const comment = {
      userId,
      postId,
      commentText,
    };

    return await this.commentRepository.save(comment);
  }
}
