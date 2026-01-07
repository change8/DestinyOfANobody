import { AppDataSource } from '../config/database.config';
import { DivinationRecord } from '../models';

export class HistoryService {
  private recordRepository = AppDataSource.getRepository(DivinationRecord);

  /**
   * 获取历史记录列表
   */
  async getRecords(userId: number, page = 1, limit = 20, type?: string) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.recordRepository
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
        created_at: r.createdAt,
        is_favorite: r.isFavorite,
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
    const record = await this.recordRepository.findOne({
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
      input_data: record.getInputData(),
      result_data: record.getResultData(),
      llm_interpretation: record.llmInterpretation,
      created_at: record.createdAt,
      is_favorite: record.isFavorite,
    };
  }

  /**
   * 删除历史记录
   */
  async deleteRecord(recordId: number, userId: number) {
    const result = await this.recordRepository.delete({ id: recordId, userId });

    if (!result.affected) {
      throw new Error('记录不存在或无权删除');
    }
  }

  /**
   * 收藏/取消收藏
   */
  async toggleFavorite(recordId: number, userId: number, isFavorite: boolean) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId, userId },
    });

    if (!record) {
      throw new Error('记录不存在');
    }

    record.isFavorite = isFavorite;
    await this.recordRepository.save(record);

    return { id: record.id, is_favorite: record.isFavorite };
  }
}

export const historyService = new HistoryService();
