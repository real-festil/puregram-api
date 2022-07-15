import { Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeService } from './likes.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likesService: LikeService) {}

  @ApiTags('Likes')
  @ApiOperation({ summary: 'Like post' })
  @Post(':id')
  async likePost(@Param('id') postId: string) {
    return await this.likesService.likePost(postId);
  }
}
