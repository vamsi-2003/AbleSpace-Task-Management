import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 'Medium' })
  priority: string;

  @Column({ nullable: true })
  leadId: string;

  @Column({ nullable: true })
  leadName: string;

  @Column({ nullable: true })
  dueDate: string;

  @Column({ default: 'Pyramid' })
  workspaceName: string;

  @CreateDateColumn()
  createdAt: Date;
}
