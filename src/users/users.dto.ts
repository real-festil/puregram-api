import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @MinLength(4)
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'username',
    required: false,
  })
  username: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'email',
    required: false,
  })
  email: string;

  @MinLength(6)
  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'Password',
    required: false,
  })
  password: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    description: 'appleId',
    required: false,
  })
  appleId?: string;

  @IsOptional()
  @ApiProperty({
    type: 'boolean',
    description: 'isVerified',
    required: false,
  })
  isVerified?: boolean;
}
