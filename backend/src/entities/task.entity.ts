import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'ToDo' })
  status: string; // 'ToDo' | 'Doing' | 'Completed' | 'OnHold' | 'Backlog'

  @Column({ default: 'NoPriority' })
  priority: string; // 'NoPriority' | 'Low' | 'Medium' | 'High' | 'Urgent'

  @Column({ nullable: true })
  dueDate: string;

  @Column({ nullable: true })
  reporterId: string;

  @Column({ nullable: true })
  reporterName: string;

  @Column({ nullable: true })
  projectId: string;

  @Column({ nullable: true })
  projectName: string;

  @Column('simple-array', { nullable: true })
  assignees: string[]; // JSON array or simple array of user names / avatar strings

  @Column('simple-array', { nullable: true })
  labels: string[]; // JSON array or simple array of label strings

  @Column('simple-array', { nullable: true })
  teams: string[]; // JSON array or simple array of team names

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
