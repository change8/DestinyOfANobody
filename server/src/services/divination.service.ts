import { baziCalculator } from '../../../src/bazi/bazi-calculator';
import { qiguaByChars, qiguaByTime, qiguaByNumber } from '../../../src/meihua/qigua';
import { divineForLostItem } from '../../../src/meihua/duangua';
import { AppDataSource } from '../config/database.config';
import { DivinationRecord } from '../models';
import type { BaziInput } from '../../../src/types';
import type { GuaResult } from '../../../src/meihua/qigua';
import { GAN_WUXING } from '../../../src/data/constants';
import { BA_GUA_DATA } from '../../../src/meihua/bagua-data';
import type { BaGua } from '../../../src/meihua/bagua-data';

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

// 前端期望的卦象格式
interface FrontendGua {
  name: string;
  symbol: string;
  number: number;
  wuxing: string;
  nature: string;
}

// 前端期望的梅花易数结果格式
interface FrontendMeihuaResult {
  benGua: FrontendGua;
  bianGua: FrontendGua;
  dongYao: number;
  huGua?: FrontendGua;
  timestamp: string;
  inputMethod: string;
}

export class DivinationService {
  // 移除模块加载时的 getRepository 调用，改为在方法内获取
  private getRecordRepository() {
    return AppDataSource.getRepository(DivinationRecord);
  }

  /**
   * 将引擎的 BaGua 转换为前端期望的 Gua 格式
   */
  private convertToFrontendGua(upperGua: BaGua, lowerGua: BaGua, guaName: string): FrontendGua {
    const upperInfo = BA_GUA_DATA[upperGua];
    const lowerInfo = BA_GUA_DATA[lowerGua];

    return {
      name: guaName,
      symbol: `${upperInfo.trigram}${lowerInfo.trigram}`,
      number: upperInfo.index * 10 + lowerInfo.index,
      wuxing: `${upperInfo.nature}${lowerInfo.nature}`,
      nature: `上${upperGua}下${lowerGua}`
    };
  }

  /**
   * 将引擎的 GuaResult 转换为前端期望的格式
   */
  private convertMeihuaResultToFrontend(guaResult: GuaResult, inputMethod: string): FrontendMeihuaResult {
    const benGua = this.convertToFrontendGua(
      guaResult.upperGua,
      guaResult.lowerGua,
      guaResult.mainGuaName
    );

    const bianGua = guaResult.changeGua
      ? this.convertToFrontendGua(
          guaResult.changeGua.upperGua,
          guaResult.changeGua.lowerGua,
          guaResult.changeGua.guaName
        )
      : benGua;

    return {
      benGua,
      bianGua,
      dongYao: guaResult.changingLine,
      timestamp: new Date().toISOString(),
      inputMethod
    };
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
    // 计算年龄：使用公历年份，避免农历临界日期偏差
    const currentYear = new Date().getFullYear();
    const birthYear = year;
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    let age = currentYear - birthYear;
    // 如果今年的生日还没到，年龄减1
    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
      age--;
    }

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
      age,
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
   * 计算卦象并保存前端格式到历史记录
   */
  async meihuaDivination(method: string, input: any, question: string, userId?: number) {
    let guaResult: GuaResult;
    let inputMethod: string;

    switch (method) {
      case 'char':
        guaResult = qiguaByChars(input.chars || input.char);
        inputMethod = '文字起卦';
        break;
      case 'time':
        guaResult = qiguaByTime(input.date ? new Date(input.date) : undefined);
        inputMethod = '时间起卦';
        break;
      case 'number':
        guaResult = qiguaByNumber(input.num1, input.num2, input.num3);
        inputMethod = '数字起卦';
        break;
      default:
        throw new Error('不支持的起卦方法');
    }

    // 失物占分析
    const analysis = divineForLostItem(guaResult, question);

    // 转换为前端格式并保存到历史记录
    if (userId) {
      const frontendResult = this.convertMeihuaResultToFrontend(guaResult, inputMethod);
      const recordRepository = this.getRecordRepository();
      const record = recordRepository.create({
        userId,
        type: 'meihua',
        title: `${question}`,
        question,
        inputData: JSON.stringify({ method, input }),
        resultData: JSON.stringify(frontendResult),  // ✅ 保存前端格式
      });
      await recordRepository.save(record);
    }

    return { guaResult, analysis };
  }
}

export const divinationService = new DivinationService();
