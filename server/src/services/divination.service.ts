import { baziCalculator } from '../../src/bazi/bazi-calculator';
import { qiguaByChars, qiguaByTime, qiguaByNumber } from '../../src/meihua/qigua';
import { divineForLostItem } from '../../src/meihua/duangua';
import { AppDataSource } from '../config/database.config';
import { DivinationRecord } from '../models';
import type { BaziInput } from '../../src/types';
import type { GuaResult } from '../../src/meihua/qigua';

export class DivinationService {
  // 移除模块加载时的 getRepository 调用，改为在方法内获取
  private getRecordRepository() {
    return AppDataSource.getRepository(DivinationRecord);
  }

  /**
   * 八字排盘
   */
  async calculateBazi(input: BaziInput, userId?: number) {
    const result = baziCalculator.calculate(input);

    // 保存到历史记录
    let recordId: number | null = null;
    if (userId) {
      const recordRepository = this.getRecordRepository();
      const record = recordRepository.create({
        userId,
        type: 'bazi',
        title: `${input.name || '未命名'}的八字排盘`,
        inputData: JSON.stringify(input),
        resultData: JSON.stringify(result),
      });
      const savedRecord = await recordRepository.save(record);
      recordId = savedRecord.id;
    }

    return { result, recordId };
  }

  /**
   * 梅花易数起卦
   */
  async meihuaDivination(method: string, input: any, question: string, userId?: number) {
    let guaResult: GuaResult;

    switch (method) {
      case 'char':
        guaResult = qiguaByChars(input.chars || input.char);
        break;
      case 'time':
        guaResult = qiguaByTime(input.date ? new Date(input.date) : undefined);
        break;
      case 'number':
        guaResult = qiguaByNumber(input.num1, input.num2, input.num3);
        break;
      default:
        throw new Error('不支持的起卦方法');
    }

    // 失物占分析
    const analysis = divineForLostItem(guaResult, question);

    // 保存到历史记录
    if (userId) {
      const recordRepository = this.getRecordRepository();
      const record = recordRepository.create({
        userId,
        type: 'meihua',
        title: `${question}`,
        question,
        inputData: JSON.stringify({ method, input }),
        resultData: JSON.stringify({ guaResult, analysis }),
      });
      await recordRepository.save(record);
    }

    return { guaResult, analysis };
  }
}

export const divinationService = new DivinationService();
