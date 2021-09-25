import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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
}