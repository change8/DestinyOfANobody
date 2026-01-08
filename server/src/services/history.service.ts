import { AppDataSource } from '../config/database.config';
import { DivinationRecord } from '../models';

export class HistoryService {
  // 移除模块加载时的 getRepository 调用
  private getRecordRepository() {
    return AppDataSource.getRepository(DivinationRecord);
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

    return {
      records: records.map(r => ({
        id: r.id,
        type: r.type,
        title: r.title,
        question: r.question,
        createdAt: r.createdAt.toISOString(),  // 改为 camelCase
        isFavorite: r.isFavorite,  // 改为 camelCase
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
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

    return {
      id: record.id,
      type: record.type,
      title: record.title,
      question: record.question,
      inputData: record.getInputData(),  // 改为 camelCase
      resultData: record.getResultData(),  // 改为 camelCase
      llmInterpretation: record.llmInterpretation,  // 改为 camelCase
      createdAt: record.createdAt.toISOString(),  // 改为 camelCase
      isFavorite: record.isFavorite,  // 改为 camelCase
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
