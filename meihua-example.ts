/**
 * 梅花易数模块使用示例
 *
 * 演示如何使用梅花易数模块进行：
 * 1. 失物占 - 找丢失的物品
 * 2. 射覆 - 猜测隐藏的物品
 * 3. 不同的起卦方式
 */

import {
  qiguaByChar,
  qiguaByNumber,
  qiguaByTime,
  divineForLostItem,
  sheFu
} from './src/meihua/index.js';

console.log('===== 梅花易数模块使用示例 =====\n');

// ==================== 示例1：字占失物 ====================
console.log('【示例1：字占失物 - 丢失钥匙】');
console.log('用户输入：\"家\" 字\n');

const gua1 = qiguaByChar('家');
console.log(`起卦结果：${gua1.mainGuaName}`);
console.log(`上卦：${gua1.upperGua} | 下卦：${gua1.lowerGua} | 动爻：${gua1.changingLine}爻`);
if (gua1.changeGua) {
  console.log(`变卦：${gua1.changeGua.guaName}\n`);
}

const result1 = divineForLostItem(gua1, '家里的钥匙找不到了', '钥匙');

console.log('💡 物品特征推断：');
console.log(`  形状：${result1.itemFeatures.可能形状.join('、')}`);
console.log(`  颜色：${result1.itemFeatures.可能颜色.join('、')}`);
console.log(`  材质：${result1.itemFeatures.可能材质.join('、')}`);
console.log(`  可能物品：${result1.itemFeatures.具体物品.slice(0, 5).join('、')}\n`);

console.log('📍 位置推断：');
console.log(`  方位：${result1.location.方位}`);
console.log(`  高低：${result1.location.高低位置}`);
console.log(`  内外：${result1.location.内外}`);
console.log(`  距离：${result1.location.距离远近}`);
console.log(`  具体位置：${result1.location.具体位置.slice(0, 5).join('、')}\n`);

console.log('⏰ 时间吉凶：');
console.log(`  能否找到：${result1.timing.能否找到 ? '✅ 可以找到' : '❌ 较难找到'}`);
console.log(`  预计时间：${result1.timing.预计时间}`);
console.log(`  吉凶：${result1.timing.吉凶}`);
console.log(`  建议：${result1.timing.建议}\n`);

console.log('📊 详细分析：');
console.log(`  ${result1.analysis.上卦分析}`);
console.log(`  ${result1.analysis.下卦分析}`);
console.log(`  ${result1.analysis.动爻分析}`);
console.log(`  ${result1.analysis.综合判断}\n`);

console.log('='.repeat(60) + '\n');

// ==================== 示例2：数字占失物 ====================
console.log('【示例2：数字占失物 - 丢失手机】');
console.log('用户报数：3 和 7\n');

const gua2 = qiguaByNumber(3, 7);
console.log(`起卦结果：${gua2.mainGuaName}`);
console.log(`上卦：${gua2.upperGua} | 下卦：${gua2.lowerGua} | 动爻：${gua2.changingLine}爻`);
if (gua2.changeGua) {
  console.log(`变卦：${gua2.changeGua.guaName}\n`);
}

const result2 = divineForLostItem(gua2, '手机不见了', '手机');

console.log('💡 物品特征：');
console.log(`  ${result2.itemFeatures.可能形状[0]}、${result2.itemFeatures.可能颜色[0]}色、${result2.itemFeatures.可能材质[0]}\n`);

console.log('📍 位置：');
console.log(`  ${result2.location.方位}方向，${result2.location.高低位置}，${result2.location.内外}`);
console.log(`  可能在：${result2.location.具体位置.slice(0, 3).join('、')}\n`);

console.log('⏰ 时间：');
console.log(`  ${result2.timing.能否找到 ? '能找到' : '难找到'} - ${result2.timing.预计时间}`);
console.log(`  💡 ${result2.timing.建议}\n`);

console.log('='.repeat(60) + '\n');

// ==================== 示例3：时间起卦射覆 ====================
console.log('【示例3：时间起卦射覆 - 猜测物品】');
const now = new Date();
console.log(`起卦时间：${now.toLocaleString('zh-CN')}\n`);

const gua3 = qiguaByTime(now);
console.log(`起卦结果：${gua3.mainGuaName}`);
console.log(`上卦：${gua3.upperGua} | 下卦：${gua3.lowerGua} | 动爻：${gua3.changingLine}爻\n`);

const result3 = sheFu(gua3);

console.log('🎯 射覆结果（猜测隐藏物品）：');
console.log(`  可能物品：${result3.可能物品.join('、')}`);
console.log(`  物品特征：${result3.物品特征}\n`);

console.log('📊 详细分析：');
console.log(`  ${result3.详细分析}\n`);

console.log('='.repeat(60) + '\n');

// ==================== 示例4：多种起卦方式对比 ====================
console.log('【示例4：多种起卦方式对比】\n');

console.log('同样的问题"钱包丢了在哪"，使用不同起卦方式：\n');

// 字占
const charGua = qiguaByChar('钱');
console.log(`1️⃣  字占（"钱"字）：${charGua.mainGuaName}`);

// 数字占
const numGua = qiguaByNumber(5, 8);
console.log(`2️⃣  数字占（5、8）：${numGua.mainGuaName}`);

// 时间占
const timeGua = qiguaByTime();
console.log(`3️⃣  时间占：${timeGua.mainGuaName}\n`);

// 对三个卦都进行失物占分析
const charResult = divineForLostItem(charGua, '钱包丢了');
const numResult = divineForLostItem(numGua, '钱包丢了');
const timeResult = divineForLostItem(timeGua, '钱包丢了');

console.log('📊 不同卦象的分析对比：\n');
console.log(`字占方位：${charResult.location.方位.split('（')[0]}`);
console.log(`数字占方位：${numResult.location.方位.split('（')[0]}`);
console.log(`时间占方位：${timeResult.location.方位.split('（')[0]}\n`);

console.log(`字占能否找到：${charResult.timing.能否找到 ? '✅' : '❌'} - ${charResult.timing.预计时间}`);
console.log(`数字占能否找到：${numResult.timing.能否找到 ? '✅' : '❌'} - ${numResult.timing.预计时间}`);
console.log(`时间占能否找到：${timeResult.timing.能否找到 ? '✅' : '❌'} - ${timeResult.timing.预计时间}\n`);

console.log('='.repeat(60) + '\n');

// ==================== 示例5：实际应用场景 ====================
console.log('【示例5：实际应用场景演示】\n');

console.log('场景：用户丢失了一个重要文件');
console.log('用户随机说了个字："找"\n');

const findGua = qiguaByChar('找');
const findResult = divineForLostItem(findGua, '重要文件找不到了', '文件');

console.log(`🔮 卦象：${findResult.gua.mainGua}`);
console.log(`   上卦 ${findResult.gua.upperGua} | 下卦 ${findResult.gua.lowerGua} | ${findResult.gua.changingLine}爻动 → ${findResult.gua.changeGua}\n`);

console.log('💼 文件特征：');
console.log(`   ${findResult.itemFeatures.物品特征.slice(0, 4).join('、')}`);
console.log(`   颜色可能是：${findResult.itemFeatures.可能颜色.slice(0, 3).join('或')}`);
console.log(`   形状可能是：${findResult.itemFeatures.可能形状.slice(0, 3).join('或')}\n`);

console.log('🧭 寻找方向：');
console.log(`   主要方位：${findResult.location.方位}`);
console.log(`   高度位置：${findResult.location.高低位置}`);
console.log(`   内外位置：${findResult.location.内外}`);
console.log(`   距离判断：${findResult.location.距离远近}\n`);

console.log('📌 重点搜索位置（按优先级）：');
findResult.location.具体位置.slice(0, 5).forEach((loc, index) => {
  console.log(`   ${index + 1}. ${loc}`);
});
console.log();

console.log('⏱️  时间预测：');
console.log(`   ${findResult.timing.能否找到? '✅ 可以找到' : '❌ 不易找到'}`);
console.log(`   时间：${findResult.timing.预计时间}`);
console.log(`   吉凶：${findResult.timing.吉凶}\n`);

console.log('💡 专家建议：');
console.log(`   ${findResult.timing.建议}\n`);

console.log('📝 卦理分析：');
console.log(`   ${findResult.analysis.综合判断}\n`);

console.log('='.repeat(60) + '\n');

console.log('✨ 梅花易数模块演示完成！\n');
console.log('💡 提示：');
console.log('   - 可以使用 qiguaByChar() 进行字占');
console.log('   - 可以使用 qiguaByNumber() 进行数字占');
console.log('   - 可以使用 qiguaByTime() 进行时间占');
console.log('   - 失物占使用 divineForLostItem()');
console.log('   - 射覆使用 sheFu()');
console.log('   - 所有方法都返回详细的分析结果\n');
