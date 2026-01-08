import { Request, Response } from 'express';
import { divinationService } from '../services/divination.service';
import { BA_GUA_DATA } from '../../../src/meihua/bagua-data';
import type { BaGua } from '../../../src/meihua/bagua-data';
import type { GuaResult } from '../../../src/meihua/qigua';

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

export class DivinationController {
  /**
   * 将引擎的 BaGua 转换为前端期望的 Gua 格式
   */
  private convertToFrontendGua(upperGua: BaGua, lowerGua: BaGua, guaName: string): FrontendGua {
    const upperInfo = BA_GUA_DATA[upperGua];
    const lowerInfo = BA_GUA_DATA[lowerGua];

    return {
      name: guaName,
      symbol: `${upperInfo.trigram}${lowerInfo.trigram}`,
      number: upperInfo.index * 10 + lowerInfo.index, // 简单的编号规则
      wuxing: `${upperInfo.nature}${lowerInfo.nature}`,
      nature: `上${upperGua}下${lowerGua}`
    };
  }

  /**
   * 将引擎的 GuaResult 转换为前端期望的格式
   */
  private convertMeihuaResult(guaResult: GuaResult, inputMethod: string): FrontendMeihuaResult {
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
      : benGua; // 如果没有变卦，使用本卦

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
   * POST /api/divination/bazi
   *
   * 接受前端发送的格式：
   * {year, month, day, hour, minute, gender, name?}
   */
  async bazi(req: Request, res: Response): Promise<void> {
    try {
      const { year, month, day, hour, minute, gender, name } = req.body;

      // 基本验证
      if (!year || !month || !day || hour === undefined || minute === undefined || !gender) {
        res.status(400).json({
          message: '请提供完整的出生信息（年月日时分和性别）',
        });
        return;
      }

      // 调用服务层，传入前端格式
      const { result } = await divinationService.calculateBazi(
        { year, month, day, hour, minute, gender, name },
        req.user?.userId
      );

      // 直接返回业务数据，不包装
      res.json(result);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : '八字排盘失败',
      });
    }
  }

  /**
   * 梅花易数起卦
   * POST /api/divination/meihua
   *
   * 接受前端发送的格式：
   * {type: 'time'|'number'|'chars', chars?, upperNumber?, lowerNumber?, changeNumber?}
   */
  async meihua(req: Request, res: Response): Promise<void> {
    try {
      const { type, chars, upperNumber, lowerNumber, changeNumber } = req.body;

      if (!type) {
        res.status(400).json({
          message: '请提供起卦方式（type）',
        });
        return;
      }

      let method: string;
      let input: any = {};
      const question = '占卜';  // 默认问题

      // 根据前端的 type 转换为后端的 method 和 input
      switch (type) {
        case 'time':
          method = 'time';
          input = {};
          break;
        case 'chars':
          if (!chars) {
            res.status(400).json({
              message: '文字起卦需要提供文字内容',
            });
            return;
          }
          method = 'char';
          input = { chars };
          break;
        case 'number':
          if (!upperNumber || !lowerNumber || !changeNumber) {
            res.status(400).json({
              message: '数字起卦需要提供上卦数、下卦数和动爻数',
            });
            return;
          }
          method = 'number';
          input = { num1: upperNumber, num2: lowerNumber, num3: changeNumber };
          break;
        default:
          res.status(400).json({
            message: '不支持的起卦方式',
          });
          return;
      }

      const { guaResult, analysis } = await divinationService.meihuaDivination(
        method,
        input,
        question,
        req.user?.userId
      );

      // 转换为前端期望的格式
      const inputMethodText = type === 'time' ? '时间起卦' : type === 'chars' ? '文字起卦' : '数字起卦';
      const frontendResult = this.convertMeihuaResult(guaResult, inputMethodText);

      res.json(frontendResult);
    } catch (error) {
      res.status(400).json({
        message: error instanceof Error ? error.message : '起卦失败',
      });
    }
  }
}

export const divinationController = new DivinationController();
