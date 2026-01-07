import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity('divination_records')
export class DivinationRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ length: 20 })
  type!: 'bazi' | 'meihua';

  @Column({ nullable: true, length: 100 })
  title?: string;

  @Column({ type: 'text', nullable: true })
  question?: string;

  @Column({ name: 'input_data', type: 'text' })
  inputData!: string; // 存储为 JSON 字符串

  @Column({ name: 'result_data', type: 'text' })
  resultData!: string; // 存储为 JSON 字符串

  @Column({ name: 'llm_interpretation', type: 'text', nullable: true })
  llmInterpretation?: string;

  @Column({ name: 'llm_model', nullable: true, length: 50 })
  llmModel?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'is_favorite', default: false })
  isFavorite!: boolean;

  // 关联关系
  @ManyToOne(() => User, (user) => user.divinationRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // 辅助方法：获取解析后的 JSON 数据
  getInputData<T = any>(): T {
    return JSON.parse(this.inputData);
  }

  getResultData<T = any>(): T {
    return JSON.parse(this.resultData);
  }

  // 辅助方法：设置 JSON 数据
  setInputData(data: any): void {
    this.inputData = JSON.stringify(data);
  }

  setResultData(data: any): void {
    this.resultData = JSON.stringify(data);
  }
}
