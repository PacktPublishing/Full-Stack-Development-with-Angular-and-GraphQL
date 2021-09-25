import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Like } from './Like';

@Entity()
export class Post {
  @PrimaryGeneratedColumn() id: number;
  @Column("longtext") text: string;
  @Column({ nullable: true }) image: string;
  @Column({ default: 0 }) commentsCount: number;
  @Column({ default: 0 }) likesCount: number;
  @Column({ default: "" }) latestLike: string;
  @CreateDateColumn() createdAt: Date;
  likedByAuthUser: boolean;
  @OneToOne(type => Comment, comment => comment.post, { onDelete: 'SET NULL' })
  @JoinColumn() latestComment: Comment;
  @ManyToOne(type => User, user => user.posts, { onDelete: 'CASCADE' }) author: User;  
  @OneToMany(type => Comment, comment => comment.post) comments: Comment[];
  @OneToMany(type => Like, like => like.post) likes: Like[];
}