import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

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
}



