import { Like } from 'src/likes/likes.entity';
import { User } from 'src/users/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'userId' })
  userId: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 250 })
  label: string;

  @Column({ type: 'int' })
  likesCount: number;

  @Column({ type: 'varchar', length: 10000 })
  imageUrl: string;

  @ManyToMany(() => Like, (like) => like.postId)
  @JoinColumn({ name: 'likeId' })
  like: Like;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
