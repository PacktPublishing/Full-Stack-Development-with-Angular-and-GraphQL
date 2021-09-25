import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn() id: number;
  @Column() text: string;
  @Column() postId: number;
  @CreateDateColumn() createdAt: Date;
}
