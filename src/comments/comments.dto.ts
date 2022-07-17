import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class AddCommentDto {
  @MinLength(1)
  @ApiProperty({
    type: 'string',
    description: 'commentText',
    required: true,
  })
  commentText: string;
}
