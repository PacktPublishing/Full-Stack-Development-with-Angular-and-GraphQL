import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { Like } from './Like';
import { Notification } from './Notification';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;
  @Column() fullName: string;
  @Column("text", { nullable: true }) bio: string;
  @Column({ unique: true }) email: string;
  @Column({ unique: true }) username: string;
  @Column() password: string;
  @Column({ nullable: true }) image: string;
  @Column({ nullable: true }) coverImage: string;
  @Column({ default: 0 }) postsCount: number;
  @CreateDateColumn() createdAt: Date;
  @OneToMany(type => Post, post => post.author) posts: Post[];
  @OneToMany(type => Comment, comment => comment.author) comments: Comment[];
  @OneToMany(type => Like, like => like.user) likes: Like[];
  @OneToMany(type => Notification, notification => notification.user) notifications: Notification[];
}



