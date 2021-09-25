import { Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn() id: number;
  @CreateDateColumn() createdAt: Date;
}