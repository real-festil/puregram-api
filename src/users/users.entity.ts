import { Post } from 'src/posts/posts.entity';
import { Subscription } from 'src/subscriptions/subscriptions.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  appleId?: string;

  @Column({ type: 'boolean' })
  isVerified?: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
}
