import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column({ default: 'You' })
  userName: string;

  @Column()
  action: string; // e.g. "changed priority from No Priority to Urgent"

  @CreateDateColumn()
  createdAt: Date;
}
