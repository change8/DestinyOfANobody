import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id', unique: true })
  userId!: number;

  @Column({ name: 'default_llm_provider', nullable: true, length: 20 })
  defaultLlmProvider?: string; // 'openai', 'anthropic', 'zhipu', etc.

  @Column({ name: 'default_llm_model', nullable: true, length: 50 })
  defaultLlmModel?: string;

  @Column({ length: 10, default: 'light' })
  theme!: string; // 'light' or 'dark'

  @Column({ length: 10, default: 'zh-CN' })
  language!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // 关联关系
  @OneToOne(() => User, (user) => user.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
