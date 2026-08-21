import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 'Guest User' })
  fullName: string;

  @Column({ nullable: true, default: 'Product Designer' })
  title: string;

  @Column({ nullable: true, default: 'guest_user' })
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isGuest: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
