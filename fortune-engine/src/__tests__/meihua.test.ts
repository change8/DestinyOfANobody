/**
 * 梅花易数模块测试
 */

import {
  qiguaByNumber,
  qiguaByChar,
  qiguaByTime,
  divineForLostItem,
  sheFu,
  getAccurateStrokeCount,
  BA_GUA_XIANG,
  BA_GUA_DATA,
  LIUSHISI_GUA
} from '../meihua';

describe('梅花易数 - 起卦测试', () => {
  describe('数字起卦', () => {
    test('单个数字起卦', () => {
      const result = qiguaByNumber(7);
      expect(result.upperGua).toBe('艮');
      expect(result.lowerGua).toBe('艮');
      expect(result.changingLine).toBeGreaterThanOrEqual(1);
      expect(result.changingLine).toBeLessThanOrEqual(6);
      expect(result.mainGuaName).toBe('艮为山');
    });

    test('两个数字起卦', () => {
      const result = qiguaByNumber(3, 7);
      expect(result.upperGua).toBe('离');
      expect(result.lowerGua).toBe('艮');
      expect(result.mainGuaName).toBe('火山旅');
    });

    test('三个数字起卦（指定动爻）', () => {
      const result = qiguaByNumber(8, 5, 4);
      expect(result.upperGua).toBe('坤');
      expect(result.lowerGua).toBe('巽');
      expect(result.changingLine).toBe(4);
    });

    test('数字为0时的处理', () => {
      const result = qiguaByNumber(0);
      expect(result.upperGua).toBe('坤');  // 0 % 8 = 0, 处理为8
      expect(result.lowerGua).toBe('坤');
    });

    test('大数字起卦', () => {
      const result = qiguaByNumber(123, 456);
      expect(result.upperGua).toBeDefined();
      expect(result.lowerGua).toBeDefined();
      expect(result.mainGuaName).toBeDefined();
    });
  });

  describe('字占起卦', () => {
    test('单字起卦 - 水', () => {
      const result = qiguaByChar('水');
      expect(result.upperGua).toBeDefined();
      expect(result.lowerGua).toBeDefined();
      expect(result.mainGuaName).toBeDefined();
    });

    test('单字起卦 - 找', () => {
      const result = qiguaByChar('找');
      const strokes = getAccurateStrokeCount('找');
      expect(strokes).toBe(7);
      expect(result.upperGua).toBe('艮');
      expect(result.lowerGua).toBe('艮');
    });

    test('指定笔画数起卦', () => {
      const result = qiguaByChar('测', 9);
      expect(result.upperGua).toBe('乾');
      expect(result.lowerGua).toBe('乾');
    });

    test('常用汉字笔画准确性', () => {
      expect(getAccurateStrokeCount('手')).toBe(4);
      expect(getAccurateStrokeCount('机')).toBe(6);
      expect(getAccurateStrokeCount('钥')).toBe(9);
      expect(getAccurateStrokeCount('匙')).toBe(11);
    });
  });

  describe('时间起卦', () => {
    test('当前时间起卦', () => {
      const result = qiguaByTime();
      expect(result.upperGua).toBeDefined();
      expect(result.lowerGua).toBeDefined();
      expect(result.changingLine).toBeGreaterThanOrEqual(1);
      expect(result.changingLine).toBeLessThanOrEqual(6);
      expect(result.mainGuaName).toBeDefined();
    });

    test('指定时间起卦', () => {
      const testDate = new Date(2024, 0, 1, 12, 0, 0);  // 2024年1月1日12:00
      const result = qiguaByTime(testDate);
      expect(result.upperGua).toBeDefined();
      expect(result.lowerGua).toBeDefined();
      expect(result.mainGuaName).toBeDefined();
    });

    test('不同时间产生不同卦象', () => {
      const date1 = new Date(2024, 0, 1, 8, 0, 0);
      const date2 = new Date(2024, 5, 15, 14, 0, 0);
      const result1 = qiguaByTime(date1);
      const result2 = qiguaByTime(date2);

      // 不同时间应该产生不同的卦象（虽然理论上可能相同，但概率很低）
      const isDifferent = result1.mainGuaName !== result2.mainGuaName ||
                          result1.changingLine !== result2.changingLine;
      expect(isDifferent).toBe(true);
    });
  });
});

describe('梅花易数 - 断卦测试', () => {
  describe('失物占', () => {
    test('基础失物占功能', () => {
      const gua = qiguaByChar('找');
      const result = divineForLostItem(gua, '钥匙丢了在哪里', '钥匙');

      expect(result.question).toBe('钥匙丢了在哪里');
      expect(result.itemName).toBe('钥匙');
      expect(result.gua).toBeDefined();
      expect(result.itemFeatures).toBeDefined();
      expect(result.location).toBeDefined();
      expect(result.timing).toBeDefined();
      expect(result.analysis).toBeDefined();
    });

    test('失物占 - 物品特征分析', () => {
      const gua = qiguaByNumber(7, 3);  // 艮离卦
      const result = divineForLostItem(gua, '手机丢了');

      expect(result.itemFeatures.可能形状.length).toBeGreaterThan(0);
      expect(result.itemFeatures.可能颜色.length).toBeGreaterThan(0);
      expect(result.itemFeatures.可能材质.length).toBeGreaterThan(0);
      expect(result.itemFeatures.物品特征.length).toBeGreaterThan(0);
      expect(result.itemFeatures.具体物品.length).toBeGreaterThan(0);
    });

    test('失物占 - 位置分析', () => {
      const gua = qiguaByNumber(1, 8);  // 乾坤卦
      const result = divineForLostItem(gua, '钱包丢了');

      expect(result.location.方位).toBeDefined();
      expect(result.location.高低位置).toBeDefined();
      expect(result.location.内外).toBeDefined();
      expect(result.location.具体位置.length).toBeGreaterThan(0);
      expect(result.location.距离远近).toBeDefined();
    });

    test('失物占 - 时间和吉凶分析', () => {
      const gua = qiguaByNumber(3, 6);  // 离坎卦
      const result = divineForLostItem(gua, '耳机丢了');

      expect(typeof result.timing.能否找到).toBe('boolean');
      expect(result.timing.预计时间).toBeDefined();
      expect(result.timing.吉凶).toBeDefined();
      expect(result.timing.建议).toBeDefined();
    });

    test('失物占 - 详细分析', () => {
      const gua = qiguaByNumber(4, 2);
      const result = divineForLostItem(gua, '戒指丢了');

      expect(result.analysis.上卦分析).toBeDefined();
      expect(result.analysis.下卦分析).toBeDefined();
      expect(result.analysis.动爻分析).toBeDefined();
      expect(result.analysis.综合判断).toBeDefined();
    });

    test('不同动爻位置的影响', () => {
      const gua1 = qiguaByNumber(5, 5, 1);  // 动爻在初爻
      const gua2 = qiguaByNumber(5, 5, 6);  // 动爻在上爻

      const result1 = divineForLostItem(gua1, '测试1');
      const result2 = divineForLostItem(gua2, '测试2');

      // 动爻位置不同应该影响分析结果
      expect(result1.analysis.动爻分析).not.toBe(result2.analysis.动爻分析);
    });
  });

  describe('射覆（猜物）', () => {
    test('基础射覆功能', () => {
      const gua = qiguaByNumber(7, 3);
      const result = sheFu(gua);

      expect(result.可能物品.length).toBeGreaterThan(0);
      expect(result.物品特征).toBeDefined();
      expect(result.详细分析).toBeDefined();
    });

    test('射覆 - 不同卦象产生不同物品', () => {
      const gua1 = qiguaByNumber(1, 1);  // 乾为天
      const gua2 = qiguaByNumber(8, 8);  // 坤为地

      const result1 = sheFu(gua1);
      const result2 = sheFu(gua2);

      expect(result1.可能物品).not.toEqual(result2.可能物品);
      expect(result1.物品特征).not.toBe(result2.物品特征);
    });

    test('射覆 - 物品特征描述完整性', () => {
      const gua = qiguaByChar('猜');
      const result = sheFu(gua);

      expect(result.物品特征).toContain('形状');
      expect(result.物品特征).toContain('颜色');
      expect(result.物品特征).toContain('材质');
      expect(result.物品特征).toContain('特征');
    });

    test('射覆 - 详细分析包含卦名', () => {
      const gua = qiguaByNumber(2, 7);
      const result = sheFu(gua);

      expect(result.详细分析).toContain(gua.upperGua);
      expect(result.详细分析).toContain(gua.lowerGua);
    });
  });
});

describe('梅花易数 - 数据完整性测试', () => {
  test('八卦类象数据完整性', () => {
    const guaList = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];

    guaList.forEach(gua => {
      const xiang = BA_GUA_XIANG[gua as keyof typeof BA_GUA_XIANG];
      expect(xiang).toBeDefined();
      expect(xiang.gua).toBe(gua);
      expect(xiang.五行).toBeDefined();
      expect(xiang.方位).toBeDefined();
      expect(xiang.物象).toBeDefined();
      expect(xiang.位置).toBeDefined();
    });
  });

  test('八卦基础数据完整性', () => {
    const guaList = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];

    guaList.forEach(gua => {
      const data = BA_GUA_DATA[gua as keyof typeof BA_GUA_DATA];
      expect(data).toBeDefined();
      expect(data.name).toBe(gua);
      expect(data.nature).toBeDefined();
      expect(data.trigram).toBeDefined();
      expect(['金', '木', '水', '火', '土']).toContain(data.nature);
    });
  });

  test('六十四卦数据完整性', () => {
    // 应该有64个卦
    const guaKeys = Object.keys(LIUSHISI_GUA);
    expect(guaKeys.length).toBe(64);

    // 每个卦都应该有完整信息
    guaKeys.forEach(key => {
      const gua = LIUSHISI_GUA[key];
      expect(gua.name).toBeDefined();
      expect(gua.upperGua).toBeDefined();
      expect(gua.lowerGua).toBeDefined();
      expect(gua.code).toBeDefined();
      expect(gua.description).toBeDefined();
    });
  });

  test('六十四卦名称唯一性', () => {
    const names = Object.values(LIUSHISI_GUA).map(g => g.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(64);
  });
});

describe('梅花易数 - 综合应用场景测试', () => {
  test('场景1：丢失钥匙（字占）', () => {
    const gua = qiguaByChar('家');
    const result = divineForLostItem(gua, '家里钥匙找不到了', '钥匙');

    expect(result.question).toBe('家里钥匙找不到了');
    expect(result.itemName).toBe('钥匙');
    expect(result.location.方位).toBeDefined();
    expect(result.timing.建议).toBeDefined();
  });

  test('场景2：丢失手机（数字占）', () => {
    const gua = qiguaByNumber(3, 7);
    const result = divineForLostItem(gua, '手机不见了', '手机');

    expect(result.itemFeatures.具体物品).toBeDefined();
    expect(result.location.具体位置.length).toBeGreaterThan(0);
  });

  test('场景3：射覆猜物（时间占）', () => {
    const gua = qiguaByTime();
    const result = sheFu(gua);

    expect(result.可能物品.length).toBeGreaterThan(0);
    expect(result.详细分析).toBeDefined();
  });

  test('场景4：完整占卜流程', () => {
    // 用户输入字
    const userInput = '找';

    // 起卦
    const gua = qiguaByChar(userInput);
    expect(gua.mainGuaName).toBeDefined();

    // 断卦 - 失物
    const lostItemResult = divineForLostItem(gua, '东西丢了在哪里');
    expect(lostItemResult.timing.能否找到).toBeDefined();

    // 断卦 - 射覆
    const shefuResult = sheFu(gua);
    expect(shefuResult.可能物品.length).toBeGreaterThan(0);
  });
});

describe('梅花易数 - 边界条件测试', () => {
  test('极大数字起卦', () => {
    const result = qiguaByNumber(9999, 8888);
    expect(result.upperGua).toBeDefined();
    expect(result.lowerGua).toBeDefined();
  });

  test('负数起卦（取绝对值）', () => {
    const result = qiguaByNumber(-5);
    expect(result.upperGua).toBeDefined();
  });

  test('未知汉字笔画数（使用默认算法）', () => {
    const strokes = getAccurateStrokeCount('罕见字');
    expect(strokes).toBeGreaterThan(0);
  });

  test('空字符串处理', () => {
    const strokes = getAccurateStrokeCount('');
    expect(strokes).toBeGreaterThan(0);  // 应该有默认值
  });
});
