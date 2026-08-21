import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column({ nullable: true })
  authorId: string;

  @Column({ default: 'Guest User' })
  authorName: string;

  @Column({ nullable: true })
  authorAvatar: string;

  @Column()
  body: string;

  @CreateDateColumn()
  createdAt: Date;
}
