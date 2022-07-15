import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './likes.controller';
import { Like } from './likes.entity';
import { LikeService } from './likes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  exports: [LikeService],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
