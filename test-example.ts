/**
 * Fortune Engine 测试示例
 */

import { calculate } from './src/index';

// 测试案例1：计算一个生日的八字
console.log('=== 测试案例1：1990年1月1日12:30出生的男性 ===');
const result1 = calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'male',
  name: '张三'
});

console.log('\n四柱八字：');
console.log(`年柱: ${result1.pillars.year.gan}${result1.pillars.year.zhi}`);
console.log(`月柱: ${result1.pillars.month.gan}${result1.pillars.month.zhi}`);
console.log(`日柱: ${result1.pillars.day.gan}${result1.pillars.day.zhi}`);
console.log(`时柱: ${result1.pillars.hour.gan}${result1.pillars.hour.zhi}`);

console.log('\n农历信息：');
console.log(`农历: ${result1.lunar.yearName} ${result1.lunar.monthName}${result1.lunar.dayName}`);

console.log('\n五行分析：');
console.log(`五行统计: 木${result1.wuxing.count.木} 火${result1.wuxing.count.火} 土${result1.wuxing.count.土} 金${result1.wuxing.count.金} 水${result1.wuxing.count.水}`);
console.log(`日主五行: ${result1.wuxing.dayMasterWuxing}`);
console.log(`日主强弱: ${result1.wuxing.dayMasterStrength}`);
console.log(`喜用神: ${result1.wuxing.xiyongshen}`);
console.log(`忌神: ${result1.wuxing.jishen}`);

console.log('\n十神分析：');
console.log(`年柱十神: ${result1.shishen.year}`);
console.log(`月柱十神: ${result1.shishen.month}`);
console.log(`日柱十神: ${result1.shishen.day}`);
console.log(`时柱十神: ${result1.shishen.hour}`);

console.log('\n纳音：');
console.log(`年柱纳音: ${result1.nayin.year}`);
console.log(`月柱纳音: ${result1.nayin.month}`);
console.log(`日柱纳音: ${result1.nayin.day}`);
console.log(`时柱纳音: ${result1.nayin.hour}`);

console.log('\n大运（前3步）：');
result1.dayun.slice(0, 3).forEach(dy => {
  console.log(`  ${dy.gan}${dy.zhi} (${dy.startAge}-${dy.endAge}岁) ${dy.nayin}`);
});

console.log('\n流年（未来5年）：');
result1.liunian.slice(0, 5).forEach(ln => {
  console.log(`  ${ln.year}年 ${ln.gan}${ln.zhi} ${ln.nayin}`);
});

console.log('\n计算耗时：', result1.metadata.calculationTime, 'ms');

// 测试案例2：测试真太阳时
console.log('\n\n=== 测试案例2：使用真太阳时（北京经度116.4°）===');
const result2 = calculate({
  birthDate: '2024-02-04',
  birthTime: '16:27', // 立春时刻附近
  gender: 'female',
  options: {
    useTrueSolarTime: true,
    longitude: 116.4074
  }
});

console.log(`四柱: ${result2.pillars.year.gan}${result2.pillars.year.zhi} ${result2.pillars.month.gan}${result2.pillars.month.zhi} ${result2.pillars.day.gan}${result2.pillars.day.zhi} ${result2.pillars.hour.gan}${result2.pillars.hour.zhi}`);
console.log(`是否使用真太阳时: ${result2.input.useTrueSolarTime}`);
