import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class AddPostDto {
  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    description: 'label',
    required: true,
  })
  label: string;
}
