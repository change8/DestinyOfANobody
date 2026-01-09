import { AppDataSource } from '../config/database.config';
import { DivinationRecord } from '../models';
import { BA_GUA_DATA } from '../../../src/meihua/bagua-data';
import type { BaGua } from '../../../src/meihua/bagua-data';
import { GAN_WUXING } from '../../../src/data/constants';

export class HistoryService {
  // 移除模块加载时的 getRepository 调用
  private getRecordRepository() {
    return AppDataSource.getRepository(DivinationRecord);
  }

  /**
   * 检测并转换旧格式的历史记录数据
   * 兼容引擎格式（旧）→ 前端 DTO 格式（新）
   */
  private normalizeResultData(resultData: any, type: string): any {
    if (!resultData) return resultData;

    // 八字记录格式检测与转换
    if (type === 'bazi') {
      // 前端格式特征：有 yearPillar 字段
      if (resultData.yearPillar) {
        return resultData; // 已是前端格式，直接返回
      }

      // 引擎格式特征：有 pillars 字段
      if (resultData.pillars) {
        // 转换为前端格式
        return {
          yearPillar: {
            gan: resultData.pillars.year.gan,
            zhi: resultData.pillars.year.zhi
          },
          monthPillar: {
            gan: resultData.pillars.month.gan,
            zhi: resultData.pillars.month.zhi
          },
          dayPillar: {
            gan: resultData.pillars.day.gan,
            zhi: resultData.pillars.day.zhi
          },
          hourPillar: {
            gan: resultData.pillars.hour.gan,
            zhi: resultData.pillars.hour.zhi
          },
          solarDate: resultData.input?.birthDate || '未知',
          lunarDate: resultData.lunar ? `${resultData.lunar.yearName} ${resultData.lunar.monthName}${resultData.lunar.dayName}` : '未知',
          age: 0, // 旧数据无法准确计算年龄
          gender: resultData.input?.gender === 'male' ? '男' : '女',
          dayGanWuxing: (GAN_WUXING as any)[resultData.pillars.day.gan] || '未知',
          mingju: resultData.nayin?.day || '未知'
        };
      }
    }

    // 梅花易数记录格式检测与转换
    if (type === 'meihua') {
      // 前端格式特征：有 benGua 字段
      if (resultData.benGua) {
        return resultData; // 已是前端格式，直接返回
      }

      // 引擎格式特征：有 guaResult 字段（旧版保存了 {guaResult, analysis}）
      if (resultData.guaResult) {
        const guaResult = resultData.guaResult;

        // 转换本卦
        const upperInfo = BA_GUA_DATA[guaResult.upperGua as BaGua];
        const lowerInfo = BA_GUA_DATA[guaResult.lowerGua as BaGua];
        const benGua = {
          name: guaResult.mainGuaName || '未知',
          symbol: upperInfo && lowerInfo ? `${upperInfo.trigram}${lowerInfo.trigram}` : '☰☷',
          number: upperInfo && lowerInfo ? upperInfo.index * 10 + lowerInfo.index : 0,
          wuxing: upperInfo && lowerInfo ? `${upperInfo.nature}${lowerInfo.nature}` : '未知',
          nature: `上${guaResult.upperGua}下${guaResult.lowerGua}`
        };

        // 转换变卦
        let bianGua = benGua;
        if (guaResult.changeGua) {
          const changeUpperInfo = BA_GUA_DATA[guaResult.changeGua.upperGua as BaGua];
          const changeLowerInfo = BA_GUA_DATA[guaResult.changeGua.lowerGua as BaGua];
          bianGua = {
            name: guaResult.changeGua.guaName || '未知',
            symbol: changeUpperInfo && changeLowerInfo ? `${changeUpperInfo.trigram}${changeLowerInfo.trigram}` : '☰☷',
            number: changeUpperInfo && changeLowerInfo ? changeUpperInfo.index * 10 + changeLowerInfo.index : 0,
            wuxing: changeUpperInfo && changeLowerInfo ? `${changeUpperInfo.nature}${changeLowerInfo.nature}` : '未知',
            nature: `上${guaResult.changeGua.upperGua}下${guaResult.changeGua.lowerGua}`
          };
        }

        return {
          benGua,
          bianGua,
          dongYao: guaResult.changingLine || 1,
          timestamp: new Date().toISOString(),
          inputMethod: guaResult.method || '未知'
        };
      }
    }

    // 无法识别的格式，返回原数据
    return resultData;
  }

  /**
   * 获取历史记录列表
   */
  async getRecords(userId: number, page = 1, limit = 20, type?: string) {
    const skip = (page - 1) * limit;
    const recordRepository = this.getRecordRepository();

    const queryBuilder = recordRepository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .orderBy('record.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (type) {
      queryBuilder.andWhere('record.type = :type', { type });
    }

    const [records, total] = await queryBuilder.getManyAndCount();

    // 拆解 pagination 到顶层，与前端 DTO 对齐
    return {
      records: records.map(r => {
        const rawResultData = r.getResultData();
        // 兼容旧格式：自动转换为前端 DTO 格式
        const normalizedResultData = this.normalizeResultData(rawResultData, r.type);

        return {
          id: r.id,
          type: r.type,
          title: r.title,
          question: r.question,
          createdAt: r.createdAt.toISOString(),
          isFavorite: r.isFavorite,
          resultData: normalizedResultData,
          llmInterpretation: r.llmInterpretation,
        };
      }),
      total,
      page,
      pageSize: limit,  // 前端使用 pageSize，后端使用 limit
    };
  }

  /**
   * 获取单条历史记录详情
   */
  async getRecordById(recordId: number, userId: number) {
    const recordRepository = this.getRecordRepository();
    const record = await recordRepository.findOne({
      where: { id: recordId, userId },
    });

    if (!record) {
      throw new Error('记录不存在');
    }

    const rawResultData = record.getResultData();
    // 兼容旧格式：自动转换为前端 DTO 格式
    const normalizedResultData = this.normalizeResultData(rawResultData, record.type);

    return {
      id: record.id,
      type: record.type,
      title: record.title,
      question: record.question,
      inputData: record.getInputData(),
      resultData: normalizedResultData,
      llmInterpretation: record.llmInterpretation,
      createdAt: record.createdAt.toISOString(),
      isFavorite: record.isFavorite,
    };
  }

  /**
   * 删除历史记录
   */
  async deleteRecord(recordId: number, userId: number) {
    const recordRepository = this.getRecordRepository();
    const result = await recordRepository.delete({ id: recordId, userId });

    if (!result.affected) {
      throw new Error('记录不存在或无权删除');
    }
  }

  /**
   * 收藏/取消收藏
   */
  async toggleFavorite(recordId: number, userId: number, isFavorite: boolean) {
    const recordRepository = this.getRecordRepository();
    const record = await recordRepository.findOne({
      where: { id: recordId, userId },
    });

    if (!record) {
      throw new Error('记录不存在');
    }

    record.isFavorite = isFavorite;
    await recordRepository.save(record);

    return { id: record.id, isFavorite: record.isFavorite };  // 改为 camelCase
  }
}

export const historyService = new HistoryService();
