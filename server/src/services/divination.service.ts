import { baziCalculator } from '../../../src/bazi/bazi-calculator';
import { qiguaByChars, qiguaByTime, qiguaByNumber } from '../../../src/meihua/qigua';
import { divineForLostItem } from '../../../src/meihua/duangua';
import { AppDataSource } from '../config/database.config';
import { DivinationRecord } from '../models';
import type { BaziInput } from '../../../src/types';
import type { GuaResult } from '../../../src/meihua/qigua';
import { GAN_WUXING } from '../../../src/data/constants';

// 前端期望的八字输入格式
interface FrontendBaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
  name?: string;
}

// 前端期望的八字结果格式
interface FrontendBaziResult {
  yearPillar: { gan: string; zhi: string };
  monthPillar: { gan: string; zhi: string };
  dayPillar: { gan: string; zhi: string };
  hourPillar: { gan: string; zhi: string };
  solarDate: string;
  lunarDate: string;
  age: number;
  gender: string;
  dayGanWuxing: string;
  mingju: string;
}

export class DivinationService {
  // 移除模块加载时的 getRepository 调用，改为在方法内获取
  private getRecordRepository() {
    return AppDataSource.getRepository(DivinationRecord);
  }

  /**
   * 八字排盘
   * 接受前端格式，转换为引擎格式，再转换结果为前端格式
   */
  async calculateBazi(frontendInput: FrontendBaziInput, userId?: number): Promise<{ result: FrontendBaziResult; recordId: number | null }> {
    const { year, month, day, hour, minute, gender, name } = frontendInput;

    // 1. 转换前端格式为引擎格式
    const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const birthTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

    const engineInput: BaziInput = {
      birthDate,
      birthTime,
      gender,
      name
    };

    // 2. 调用引擎计算
    const engineResult = baziCalculator.calculate(engineInput);

    // 3. 转换引擎结果为前端格式
    const frontendResult: FrontendBaziResult = {
      yearPillar: {
        gan: engineResult.pillars.year.gan,
        zhi: engineResult.pillars.year.zhi
      },
      monthPillar: {
        gan: engineResult.pillars.month.gan,
        zhi: engineResult.pillars.month.zhi
      },
      dayPillar: {
        gan: engineResult.pillars.day.gan,
        zhi: engineResult.pillars.day.zhi
      },
      hourPillar: {
        gan: engineResult.pillars.hour.gan,
        zhi: engineResult.pillars.hour.zhi
      },
      solarDate: `${year}年${month}月${day}日 ${hour}时${minute}分`,
      lunarDate: `${engineResult.lunar.yearName} ${engineResult.lunar.monthName}${engineResult.lunar.dayName}`,
      age: new Date().getFullYear() - engineResult.lunar.year,
      gender: gender === 'male' ? '男' : '女',
      dayGanWuxing: GAN_WUXING[engineResult.pillars.day.gan],
      mingju: engineResult.nayin.day
    };

    // 4. 保存到历史记录（保存前端输入和前端结果格式）
    let recordId: number | null = null;
    if (userId) {
      const recordRepository = this.getRecordRepository();
      const record = recordRepository.create({
        userId,
        type: 'bazi',
        title: `${name || '未命名'}的八字排盘`,
        inputData: JSON.stringify(frontendInput),
        resultData: JSON.stringify(frontendResult),
      });
      const savedRecord = await recordRepository.save(record);
      recordId = savedRecord.id;
    }

    return { result: frontendResult, recordId };
  }

  /**
   * 梅花易数起卦
   * 注意：结果会在 controller 层转换为前端格式
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

    // 保存到历史记录（暂时保存引擎格式，后续可优化为前端格式）
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
