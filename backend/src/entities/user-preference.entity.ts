import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ default: 'light' })
  themeMode: string; // 'light' | 'dark'

  @Column({ default: 'amber' })
  accentColor: string; // 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black'

  @UpdateDateColumn()
  updatedAt: Date;
}
