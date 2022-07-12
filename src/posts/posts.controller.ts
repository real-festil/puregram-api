import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddPostDto } from './posts.dto';
import { PostService } from './posts.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get all posts' })
  @Get()
  async getAllPosts() {
    return await this.postService.getPosts();
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get single post' })
  @Get(':id')
  async getSinglePost(@Param('id') postId: string) {
    return await this.postService.getSinglePost(postId);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Get posts by user' })
  @Get('user/:userId')
  async getPostsByUserId(@Param('userId') userId: string) {
    return await this.postService.getPostsByUser(userId);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Add new post' })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addPost(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: AddPostDto,
  ) {
    console.log('Add post: ', body.label, '\n', image);
    return await this.postService.addPost(image, body.label);
  }

  @ApiTags('Posts')
  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  async deletePost(@Param('id') postId: string) {
    return await this.postService.deletePost(postId);
  }
}
