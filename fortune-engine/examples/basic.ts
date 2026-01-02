/**
 * Fortune Engine - 基础使用示例
 */

import { calculate } from '../src';

// 示例1：基础排盘
console.log('=== 示例1：基础排盘 ===');
const result1 = calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'male',
  name: '张三'
});

console.log('姓名：', result1.input.name);
console.log('生辰：', result1.input.birthDate, result1.input.birthTime);
console.log('\n四柱八字：');
console.log('年柱：', result1.pillars.year.gan + result1.pillars.year.zhi);
console.log('月柱：', result1.pillars.month.gan + result1.pillars.month.zhi);
console.log('日柱：', result1.pillars.day.gan + result1.pillars.day.zhi);
console.log('时柱：', result1.pillars.hour.gan + result1.pillars.hour.zhi);

console.log('\n十神：');
console.log('年：', result1.shishen.year);
console.log('月：', result1.shishen.month);
console.log('日：', result1.shishen.day);
console.log('时：', result1.shishen.hour);

console.log('\n纳音：');
console.log('年：', result1.nayin.year);
console.log('月：', result1.nayin.month);
console.log('日：', result1.nayin.day);
console.log('时：', result1.nayin.hour);

console.log('\n五行分析：');
console.log('五行个数：', result1.wuxing.count);
console.log('五行力量：', result1.wuxing.strength);
console.log('日主五行：', result1.wuxing.dayMasterWuxing);
console.log('日主强弱：', result1.wuxing.dayMasterStrength);
console.log('喜用神：', result1.wuxing.xiyongshen);
console.log('忌神：', result1.wuxing.jishen);

console.log('\n大运（前3步）：');
result1.dayun.slice(0, 3).forEach((dy, index) => {
  console.log(
    `第${index + 1}步：${dy.startAge}-${dy.endAge}岁 ${dy.gan}${dy.zhi} (${dy.nayin})`
  );
});

console.log('\n计算耗时：', result1.metadata.calculationTime, 'ms');

// 示例2：使用真太阳时
console.log('\n\n=== 示例2：真太阳时修正 ===');
const result2 = calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'male',
  options: {
    useTrueSolarTime: true,
    longitude: 116.4074 // 北京经度
  }
});

console.log('四柱（真太阳时）：');
console.log(
  `${result2.pillars.year.gan}${result2.pillars.year.zhi} ` +
  `${result2.pillars.month.gan}${result2.pillars.month.zhi} ` +
  `${result2.pillars.day.gan}${result2.pillars.day.zhi} ` +
  `${result2.pillars.hour.gan}${result2.pillars.hour.zhi}`
);

// 示例3：子时处理
console.log('\n\n=== 示例3：子时处理 ===');
const result3 = calculate({
  birthDate: '1990-01-01',
  birthTime: '23:30',
  gender: 'male',
  options: {
    ziShiMethod: 'traditional' // 夜子时算第二天
  }
});

console.log('时柱：', result3.pillars.hour.gan + result3.pillars.hour.zhi);
console.log('日柱：', result3.pillars.day.gan + result3.pillars.day.zhi);
