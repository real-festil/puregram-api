import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './users.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserNotExistsGuard } from './users.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Users')
  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUsers() {
    return await this.userService.getUsers();
  }

  @ApiTags('Users')
  @UseGuards(UserNotExistsGuard)
  @ApiOperation({ summary: 'Get single users' })
  @Get(':id')
  async getUser(@Param('id') userId: string) {
    return await this.userService.getSingleUser(userId);
  }

  @ApiTags('Users')
  @UseGuards(UserNotExistsGuard)
  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userId, updateUserDto);
  }

  @ApiTags('Users')
  @UseGuards(UserNotExistsGuard)
  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return await this.userService.deleteUser(userId);
  }
}
