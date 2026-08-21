import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('subtasks')
export class Subtask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  priority: string;

  @Column({ nullable: true })
  assigneeName: string;

  @Column({ nullable: true })
  dueDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
