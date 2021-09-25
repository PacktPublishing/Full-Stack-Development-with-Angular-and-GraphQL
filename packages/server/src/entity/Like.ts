import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ManyToOne } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn() id: number;
  @CreateDateColumn() createdAt: Date;
  @ManyToOne(type => User, user => user.likes, { onDelete: 'CASCADE' })
  user: User;  
  @ManyToOne(type => Post, post => post.likes, { onDelete: 'CASCADE' })
  post: Post;
}