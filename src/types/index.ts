/**
 * 八字算命引擎 - 类型定义
 * @module types
 */

/**
 * 天干类型
 */
export type Tiangan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

/**
 * 地支类型
 */
export type Dizhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

/**
 * 五行类型
 */
export type Wuxing = '木' | '火' | '土' | '金' | '水';

/**
 * 阴阳类型
 */
export type YinYang = '阴' | '阳';

/**
 * 性别类型
 */
export type Gender = 'male' | 'female';

/**
 * 十神类型
 */
export type ShiShen =
  | '比肩'
  | '劫财'
  | '食神'
  | '伤官'
  | '偏财'
  | '正财'
  | '七杀'
  | '正官'
  | '偏印'
  | '正印';

/**
 * 柱（干支组合）
 */
export interface Pillar {
  /** 天干 */
  gan: Tiangan;
  /** 地支 */
  zhi: Dizhi;
  /** 天干索引 (0-9) */
  ganIndex: number;
  /** 地支索引 (0-11) */
  zhiIndex: number;
  /** 六十甲子索引 (0-59) */
  jiaziIndex?: number;
}

/**
 * 四柱（八字）
 */
export interface Pillars {
  /** 年柱 */
  year: Pillar;
  /** 月柱 */
  month: Pillar;
  /** 日柱 */
  day: Pillar;
  /** 时柱 */
  hour: Pillar;
}

/**
 * 十神分析
 */
export interface ShiShenAnalysis {
  year: ShiShen;
  month: ShiShen;
  day: '日主'; // 日柱永远是日主
  hour: ShiShen;
}

/**
 * 纳音五行
 */
export interface NayinAnalysis {
  year: string;
  month: string;
  day: string;
  hour: string;
}

/**
 * 藏干
 */
export interface CangganAnalysis {
  year: Tiangan[];
  month: Tiangan[];
  day: Tiangan[];
  hour: Tiangan[];
}

/**
 * 五行统计
 */
export interface WuxingCount {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

/**
 * 五行力量
 */
export interface WuxingStrength {
  木: number;
  火: number;
  土: number;
  金: number;
  水: number;
}

/**
 * 五行分析
 */
export interface WuxingAnalysis {
  /** 五行个数 */
  count: WuxingCount;
  /** 五行力量（百分比） */
  strength: WuxingStrength;
  /** 日主五行 */
  dayMasterWuxing: Wuxing;
  /** 日主强弱 */
  dayMasterStrength: '身旺' | '中和' | '身弱';
  /** 喜用神 */
  xiyongshen: string;
  /** 忌神 */
  jishen: string;
}

/**
 * 大运
 */
export interface Dayun {
  /** 天干 */
  gan: Tiangan;
  /** 地支 */
  zhi: Dizhi;
  /** 开始年龄 */
  startAge: number;
  /** 结束年龄 */
  endAge: number;
  /** 纳音 */
  nayin?: string;
}

/**
 * 流年
 */
export interface Liunian {
  /** 年份 */
  year: number;
  /** 天干 */
  gan: Tiangan;
  /** 地支 */
  zhi: Dizhi;
  /** 纳音 */
  nayin: string;
  /** 运势评分 (0-100) */
  fortuneScore?: number;
}

/**
 * 排盘选项
 */
export interface BaziOptions {
  /** 时区，默认东八区(8) */
  timezone?: number;
  /** 是否使用真太阳时 */
  useTrueSolarTime?: boolean;
  /** 经度（真太阳时需要），东经为正 */
  longitude?: number;
  /** 子时处理方式 */
  ziShiMethod?: 'traditional' | 'modern';
}

/**
 * 排盘输入
 */
export interface BaziInput {
  /** 出生日期 (YYYY-MM-DD) */
  birthDate: string | Date;
  /** 出生时间 (HH:mm) */
  birthTime: string;
  /** 性别 */
  gender: Gender;
  /** 姓名（可选） */
  name?: string;
  /** 选项 */
  options?: BaziOptions;
}

/**
 * 排盘结果
 */
export interface BaziResult {
  /** 输入信息 */
  input: {
    birthDate: string;
    birthTime: string;
    gender: Gender;
    name?: string;
    timezone: number;
    useTrueSolarTime: boolean;
    longitude?: number;
    ziShiMethod: string;
  };

  /** 农历信息 */
  lunar: {
    year: number;
    month: number;
    day: number;
    leapMonth: boolean;
    yearName: string;
    monthName: string;
    dayName: string;
  };

  /** 四柱 */
  pillars: Pillars;

  /** 十神 */
  shishen: ShiShenAnalysis;

  /** 纳音 */
  nayin: NayinAnalysis;

  /** 藏干 */
  canggan: CangganAnalysis;

  /** 五行分析 */
  wuxing: WuxingAnalysis;

  /** 大运 */
  dayun: Dayun[];

  /** 流年（近10年） */
  liunian: Liunian[];

  /** 计算元数据 */
  metadata: {
    version: string;
    calculatedAt: string;
    calculationTime: number; // 毫秒
  };
}

/**
 * 农历日期
 */
export interface LunarDate {
  /** 农历年 */
  year: number;
  /** 农历月 (1-12) */
  month: number;
  /** 农历日 (1-30) */
  day: number;
  /** 是否闰月 */
  leapMonth: boolean;
  /** 年份名称（如：庚子年） */
  yearName: string;
  /** 月份名称（如：腊月） */
  monthName: string;
  /** 日期名称（如：初一） */
  dayName: string;
}

/**
 * 节气信息
 */
export interface Jieqi {
  /** 节气名称 */
  name: string;
  /** 节气时间 */
  time: Date;
  /** 太阳黄经 */
  solarLongitude: number;
}

/**
 * 错误类型
 */
export class BaziError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BaziError';
  }
}

export class InvalidDateError extends BaziError {
  constructor(message: string = '无效的日期') {
    super(message);
    this.name = 'InvalidDateError';
  }
}

export class InvalidTimeError extends BaziError {
  constructor(message: string = '无效的时间格式') {
    super(message);
    this.name = 'InvalidTimeError';
  }
}

export class OutOfRangeError extends BaziError {
  constructor(message: string = '日期超出支持范围（1900-2100）') {
    super(message);
    this.name = 'OutOfRangeError';
  }
}
