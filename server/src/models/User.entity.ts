import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { DivinationRecord } from './DivinationRecord.entity';
import { UserPreferences } from './UserPreferences.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ nullable: true, length: 50 })
  nickname?: string;

  @Column({ name: 'avatar_url', nullable: true, length: 255 })
  avatarUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  // 关联关系
  @OneToMany(() => DivinationRecord, (record) => record.user)
  divinationRecords?: DivinationRecord[];

  @OneToOne(() => UserPreferences, (preferences) => preferences.user)
  preferences?: UserPreferences;

  // 返回给前端时排除密码
  toJSON() {
    const { passwordHash, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
