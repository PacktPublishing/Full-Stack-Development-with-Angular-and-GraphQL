import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn() id: number;
  @Column("text") comment: string;
  @CreateDateColumn() createdAt: Date;
}


