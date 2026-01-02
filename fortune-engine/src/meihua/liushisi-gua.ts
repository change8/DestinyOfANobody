/**
 * 六十四卦数据
 */

import type { BaGua } from './bagua-data';

/**
 * 六十四卦信息
 */
export interface LiuShiSiGua {
  name: string;           // 卦名
  upperGua: BaGua;       // 上卦
  lowerGua: BaGua;       // 下卦
  code: string;          // 卦序
  description: string;    // 简述
}

/**
 * 六十四卦表
 */
export const LIUSHISI_GUA: Record<string, LiuShiSiGua> = {
  '乾乾': { name: '乾为天', upperGua: '乾', lowerGua: '乾', code: '01', description: '刚健中正，自强不息' },
  '乾兑': { name: '天泽履', upperGua: '乾', lowerGua: '兑', code: '10', description: '履险如夷，谨慎而行' },
  '乾离': { name: '天火同人', upperGua: '乾', lowerGua: '离', code: '13', description: '同心协力，聚合众人' },
  '乾震': { name: '天雷无妄', upperGua: '乾', lowerGua: '震', code: '25', description: '守正无妄，不期而遇' },
  '乾巽': { name: '天风姤', upperGua: '乾', lowerGua: '巽', code: '44', description: '邂逅相遇，柔遇刚' },
  '乾坎': { name: '天水讼', upperGua: '乾', lowerGua: '坎', code: '06', description: '争讼不宜，中正自守' },
  '乾艮': { name: '天山遁', upperGua: '乾', lowerGua: '艮', code: '33', description: '退避三舍，隐遁为上' },
  '乾坤': { name: '天地否', upperGua: '乾', lowerGua: '坤', code: '12', description: '否塞不通，君子自守' },

  '兑乾': { name: '泽天夬', upperGua: '兑', lowerGua: '乾', code: '43', description: '刚决柔，去小人' },
  '兑兑': { name: '兑为泽', upperGua: '兑', lowerGua: '兑', code: '58', description: '喜悦和悦，交流畅通' },
  '兑离': { name: '泽火革', upperGua: '兑', lowerGua: '离', code: '49', description: '革故鼎新，改革变化' },
  '兑震': { name: '泽雷随', upperGua: '兑', lowerGua: '震', code: '17', description: '随时而动，顺应时势' },
  '兑巽': { name: '泽风大过', upperGua: '兑', lowerGua: '巽', code: '28', description: '大过其度，负重难行' },
  '兑坎': { name: '泽水困', upperGua: '兑', lowerGua: '坎', code: '47', description: '困境之中，等待时机' },
  '兑艮': { name: '泽山咸', upperGua: '兑', lowerGua: '艮', code: '31', description: '感应相通，男女相感' },
  '兑坤': { name: '泽地萃', upperGua: '兑', lowerGua: '坤', code: '45', description: '聚合萃集，汇聚一堂' },

  '离乾': { name: '火天大有', upperGua: '离', lowerGua: '乾', code: '14', description: '大有所得，丰收繁荣' },
  '离兑': { name: '火泽睽', upperGua: '离', lowerGua: '兑', code: '38', description: '乖离睽违，分道扬镳' },
  '离离': { name: '离为火', upperGua: '离', lowerGua: '离', code: '30', description: '附丽光明，文明之象' },
  '离震': { name: '火雷噬嗑', upperGua: '离', lowerGua: '震', code: '21', description: '咬合刑法，断决果断' },
  '离巽': { name: '火风鼎', upperGua: '离', lowerGua: '巽', code: '50', description: '革新鼎立，稳固基业' },
  '离坎': { name: '火水未济', upperGua: '离', lowerGua: '坎', code: '64', description: '未完成，谨慎终始' },
  '离艮': { name: '火山旅', upperGua: '离', lowerGua: '艮', code: '56', description: '旅居在外，小心谨慎' },
  '离坤': { name: '火地晋', upperGua: '离', lowerGua: '坤', code: '35', description: '晋升进取，光明磊落' },

  '震乾': { name: '雷天大壮', upperGua: '震', lowerGua: '乾', code: '34', description: '刚壮盛大，正大光明' },
  '震兑': { name: '雷泽归妹', upperGua: '震', lowerGua: '兑', code: '54', description: '女归于男，嫁娶之象' },
  '震离': { name: '雷火丰', upperGua: '震', lowerGua: '离', code: '55', description: '丰盛美满，盛大繁荣' },
  '震震': { name: '震为雷', upperGua: '震', lowerGua: '震', code: '51', description: '震动奋起，惊恐戒惧' },
  '震巽': { name: '雷风恒', upperGua: '震', lowerGua: '巽', code: '32', description: '恒久不变，持之以恒' },
  '震坎': { name: '雷水解', upperGua: '震', lowerGua: '坎', code: '40', description: '解除困难，危机解除' },
  '震艮': { name: '雷山小过', upperGua: '震', lowerGua: '艮', code: '62', description: '小有过越，谨慎行事' },
  '震坤': { name: '雷地豫', upperGua: '震', lowerGua: '坤', code: '16', description: '愉悦欢乐，和顺之象' },

  '巽乾': { name: '风天小畜', upperGua: '巽', lowerGua: '乾', code: '09', description: '小有蓄积，密云不雨' },
  '巽兑': { name: '风泽中孚', upperGua: '巽', lowerGua: '兑', code: '61', description: '诚信之道，信孚于人' },
  '巽离': { name: '风火家人', upperGua: '巽', lowerGua: '离', code: '37', description: '家道正，治家有方' },
  '巽震': { name: '风雷益', upperGua: '巽', lowerGua: '震', code: '42', description: '增益进步，利益大增' },
  '巽巽': { name: '巽为风', upperGua: '巽', lowerGua: '巽', code: '57', description: '柔顺谦逊，随风而动' },
  '巽坎': { name: '风水涣', upperGua: '巽', lowerGua: '坎', code: '59', description: '涣散分离，聚散无常' },
  '巽艮': { name: '风山渐', upperGua: '巽', lowerGua: '艮', code: '53', description: '渐进发展，循序渐进' },
  '巽坤': { name: '风地观', upperGua: '巽', lowerGua: '坤', code: '20', description: '观察省视，观摩学习' },

  '坎乾': { name: '水天需', upperGua: '坎', lowerGua: '乾', code: '05', description: '需要等待，守时待机' },
  '坎兑': { name: '水泽节', upperGua: '坎', lowerGua: '兑', code: '60', description: '节制约束，适可而止' },
  '坎离': { name: '水火既济', upperGua: '坎', lowerGua: '离', code: '63', description: '已经成功，事业完成' },
  '坎震': { name: '水雷屯', upperGua: '坎', lowerGua: '震', code: '03', description: '屯积艰难，创始不易' },
  '坎巽': { name: '水风井', upperGua: '坎', lowerGua: '巽', code: '48', description: '井水养人，改造更新' },
  '坎坎': { name: '坎为水', upperGua: '坎', lowerGua: '坎', code: '29', description: '重重险陷，冒险前进' },
  '坎艮': { name: '水山蹇', upperGua: '坎', lowerGua: '艮', code: '39', description: '艰难险阻，进退维谷' },
  '坎坤': { name: '水地比', upperGua: '坎', lowerGua: '坤', code: '08', description: '亲比和睦，辅佐贤明' },

  '艮乾': { name: '山天大畜', upperGua: '艮', lowerGua: '乾', code: '26', description: '大有蓄积，止而不动' },
  '艮兑': { name: '山泽损', upperGua: '艮', lowerGua: '兑', code: '41', description: '损己益人，减损抑制' },
  '艮离': { name: '山火贲', upperGua: '艮', lowerGua: '离', code: '22', description: '文饰华美，外表光鲜' },
  '艮震': { name: '山雷颐', upperGua: '艮', lowerGua: '震', code: '27', description: '养育生息，修养自身' },
  '艮巽': { name: '山风蛊', upperGua: '艮', lowerGua: '巽', code: '18', description: '蛊惑之象，治乱除弊' },
  '艮坎': { name: '山水蒙', upperGua: '艮', lowerGua: '坎', code: '04', description: '蒙昧无知，启蒙教育' },
  '艮艮': { name: '艮为山', upperGua: '艮', lowerGua: '艮', code: '52', description: '止息停留，静止不动' },
  '艮坤': { name: '山地剥', upperGua: '艮', lowerGua: '坤', code: '23', description: '剥落衰败，不利君子' },

  '坤乾': { name: '地天泰', upperGua: '坤', lowerGua: '乾', code: '11', description: '通泰安康，天地交泰' },
  '坤兑': { name: '地泽临', upperGua: '坤', lowerGua: '兑', code: '19', description: '临近君临，自上临下' },
  '坤离': { name: '地火明夷', upperGua: '坤', lowerGua: '离', code: '36', description: '光明受损，明珠蒙尘' },
  '坤震': { name: '地雷复', upperGua: '坤', lowerGua: '震', code: '24', description: '复返回归，剥极必复' },
  '坤巽': { name: '地风升', upperGua: '坤', lowerGua: '巽', code: '46', description: '上升发展，步步高升' },
  '坤坎': { name: '地水师', upperGua: '坤', lowerGua: '坎', code: '07', description: '师众兴兵，统率军队' },
  '坤艮': { name: '地山谦', upperGua: '坤', lowerGua: '艮', code: '15', description: '谦虚恭敬，吉祥亨通' },
  '坤坤': { name: '坤为地', upperGua: '坤', lowerGua: '坤', code: '02', description: '柔顺厚德，厚德载物' }
};

/**
 * 获取卦名
 */
export function getGuaName(upperGua: BaGua, lowerGua: BaGua): string {
  const key = `${upperGua}${lowerGua}`;
  return LIUSHISI_GUA[key]?.name || '未知卦';
}

/**
 * 获取卦象信息
 */
export function getGuaInfo(upperGua: BaGua, lowerGua: BaGua): LiuShiSiGua | null {
  const key = `${upperGua}${lowerGua}`;
  return LIUSHISI_GUA[key] || null;
}
