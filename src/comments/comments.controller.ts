import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddCommentDto } from './comments.dto';
import { CommentService } from './comments.service';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentsService: CommentService) {}

  @ApiTags('Comments')
  @ApiOperation({ summary: 'Comment post' })
  @Post(':id')
  async likePost(
    @Param('id') postId: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return await this.commentsService.addComment(
      postId,
      addCommentDto.commentText,
    );
  }
}
