/**
 * Fortune Engine LLM 集成完整示例
 *
 * 演示完整流程：
 * 1. 用户输入自然语言
 * 2. LLM 理解用户意图并提取结构化数据
 * 3. Fortune Engine 执行确定性计算
 * 4. LLM 将结果解读为人性化文字
 */

import { BaziCalculator, meihua, llm } from './dist/index.esm.js';

// ==================== 配置说明 ====================
console.log('='.repeat(80));
console.log('Fortune Engine LLM 集成示例');
console.log('='.repeat(80));
console.log('\n⚠️  注意：运行此示例需要配置 LLM API Key');
console.log('\n支持的提供商:');
console.log('  - OpenAI (GPT-4/3.5)');
console.log('  - Anthropic (Claude)');
console.log('  - 智谱AI (GLM-4) - 推荐国内用户');
console.log('  - 通义千问 (Qwen)');
console.log('  - DeepSeek\n');

// ==================== 配置 LLM 客户端 ====================
// 方式1: 使用环境变量 (推荐)
// export OPENAI_API_KEY=sk-...
// export ZHIPU_API_KEY=...

// 方式2: 直接配置 (仅用于测试)
const LLM_CONFIG: llm.LLMConfig = {
  // 选择提供商 - 修改这里选择不同的 LLM
  provider: 'zhipu',  // 'openai' | 'anthropic' | 'zhipu' | 'qwen' | 'deepseek'

  // API Key - 从环境变量读取
  apiKey: process.env.ZHIPU_API_KEY || process.env.OPENAI_API_KEY || '',

  // 使用默认配置
  ...llm.DEFAULT_LLM_CONFIGS.zhipu
};

// 检查 API Key
if (!LLM_CONFIG.apiKey) {
  console.error('❌ 错误: 未找到 API Key');
  console.error('   请设置环境变量，例如:');
  console.error('   export OPENAI_API_KEY=sk-your-key');
  console.error('   export ZHIPU_API_KEY=your-key\n');
  process.exit(1);
}

console.log(`✅ 使用 LLM 提供商: ${LLM_CONFIG.provider}`);
console.log(`   模型: ${LLM_CONFIG.model}\n`);

// 创建 LLM 客户端
const client = llm.createLLMClient(LLM_CONFIG);

// 创建服务
const understandingService = new llm.InputUnderstandingService(client);
const interpretationService = new llm.ResultInterpretationService(client);

// ==================== 示例1: 八字排盘完整流程 ====================
async function example1_BaziFullFlow() {
  console.log('\n' + '='.repeat(80));
  console.log('示例1: 八字排盘 - 完整 LLM 集成流程');
  console.log('='.repeat(80));

  // 模拟用户输入的自然语言
  const userInput = '我是1990年1月15日早上8点出生的男性,帮我算算八字,看看我的事业运如何';
  console.log(`\n📝 用户输入:\n   "${userInput}"\n`);

  // 步骤1: 使用 LLM 理解用户输入
  console.log('⏳ 步骤1: LLM 理解用户输入...');
  const understanding = await understandingService.understand(userInput);

  console.log('\n✅ 理解结果:');
  console.log(`   占卜类型: ${understanding.divinationType}`);
  console.log(`   置信度: ${(understanding.confidence * 100).toFixed(0)}%`);
  console.log(`   提取信息:`);
  console.log(`     - 出生日期: ${understanding.extractedInfo.birthDateTime?.date}`);
  console.log(`     - 出生时间: ${understanding.extractedInfo.birthDateTime?.time}`);
  console.log(`     - 性别: ${understanding.extractedInfo.gender}`);
  console.log(`     - 问题: ${understanding.extractedInfo.question || '无'}`);

  if (understanding.clarificationNeeded && understanding.clarificationNeeded.length > 0) {
    console.log(`   需要澄清: ${understanding.clarificationNeeded.join(', ')}`);
    return;
  }

  // 验证理解结果
  if (!understandingService.validateUnderstanding(understanding)) {
    console.error('\n❌ 理解结果不完整，无法继续计算');
    return;
  }

  // 步骤2: 使用 Fortune Engine 进行确定性计算
  console.log('\n⏳ 步骤2: 执行八字排盘计算...');
  const calculator = new BaziCalculator();
  const result = calculator.calculate({
    birthDate: understanding.extractedInfo.birthDateTime!.date,
    birthTime: understanding.extractedInfo.birthDateTime!.time,
    gender: understanding.extractedInfo.gender!
  });

  console.log('\n✅ 计算完成:');
  console.log(`   四柱: ${result.pillars.year.gan}${result.pillars.year.zhi} ${result.pillars.month.gan}${result.pillars.month.zhi} ${result.pillars.day.gan}${result.pillars.day.zhi} ${result.pillars.hour.gan}${result.pillars.hour.zhi}`);
  console.log(`   日主: ${result.wuxing.dayMasterWuxing}`);
  console.log(`   强弱: ${result.wuxing.dayMasterStrength}`);
  console.log(`   计算耗时: ${result.metadata.calculationTime}ms`);

  // 步骤3: 使用 LLM 解读结果
  console.log('\n⏳ 步骤3: LLM 解读计算结果...');
  const interpretation = await interpretationService.interpretBazi(
    result,
    understanding.extractedInfo.question || userInput,
    'professional'  // professional | casual | detailed | concise
  );

  // 步骤4: 格式化并显示最终结果
  console.log('\n✅ 解读完成!\n');
  console.log('='.repeat(80));
  const formattedText = interpretationService.formatInterpretationText(interpretation);
  console.log(formattedText);
  console.log('='.repeat(80));
}

// ==================== 示例2: 梅花易数失物占 ====================
async function example2_MeihuaLostItem() {
  console.log('\n' + '='.repeat(80));
  console.log('示例2: 梅花易数失物占 - 完整 LLM 集成流程');
  console.log('='.repeat(80));

  // 模拟用户输入
  const userInput = '我的钥匙丢了,在哪里能找到?用"找"字起卦';
  console.log(`\n📝 用户输入:\n   "${userInput}"\n`);

  // 步骤1: LLM 理解用户输入
  console.log('⏳ 步骤1: LLM 理解用户输入...');
  const understanding = await understandingService.understand(userInput);

  console.log('\n✅ 理解结果:');
  console.log(`   占卜类型: ${understanding.divinationType}`);
  console.log(`   丢失物品: ${understanding.extractedInfo.lostItem || '未知'}`);
  console.log(`   起卦用字: ${understanding.extractedInfo.characters?.join(', ') || '无'}`);

  // 提取关键信息
  const lostItem = understanding.extractedInfo.lostItem || '物品';
  const char = understanding.extractedInfo.characters?.[0] || '找';
  const question = understanding.extractedInfo.question || userInput;

  // 步骤2: 起卦 (确定性算法)
  console.log(`\n⏳ 步骤2: 使用"${char}"字起卦...`);
  const gua = meihua.qiguaByChar(char);
  console.log(`\n✅ 起卦完成:`);
  console.log(`   主卦: ${gua.mainGuaName}`);
  console.log(`   上卦: ${gua.upperGua} | 下卦: ${gua.lowerGua}`);
  console.log(`   动爻: ${gua.changingLine}爻`);
  if (gua.changeGua) {
    console.log(`   变卦: ${gua.changeGua.guaName}`);
  }

  // 步骤3: 断卦 (确定性算法)
  console.log(`\n⏳ 步骤3: 断卦分析...`);
  const divineResult = meihua.divineForLostItem(gua, question, lostItem);

  console.log('\n✅ 断卦完成:');
  console.log(`   方位: ${divineResult.location.方位}`);
  console.log(`   位置: ${divineResult.location.高低位置}, ${divineResult.location.内外}`);
  console.log(`   能否找到: ${divineResult.timing.能否找到 ? '是' : '否'}`);
  console.log(`   预计时间: ${divineResult.timing.预计时间}`);

  // 步骤4: LLM 解读结果
  console.log('\n⏳ 步骤4: LLM 生成人性化解读...');
  const interpretation = await interpretationService.interpretMeihua(
    divineResult,
    userInput,
    'casual'  // 使用轻松友好的风格
  );

  // 显示最终结果
  console.log('\n✅ 解读完成!\n');
  console.log('='.repeat(80));
  const formattedText = interpretationService.formatInterpretationText(interpretation);
  console.log(formattedText);
  console.log('='.repeat(80));
}

// ==================== 示例3: 对比不同解读风格 ====================
async function example3_DifferentStyles() {
  console.log('\n' + '='.repeat(80));
  console.log('示例3: 对比不同解读风格');
  console.log('='.repeat(80));

  // 使用固定的计算结果
  const calculator = new BaziCalculator();
  const result = calculator.calculate({
    birthDate: '1995-06-15',
    birthTime: '14:30',
    gender: 'female'
  });

  console.log(`\n四柱: ${result.pillars.year.gan}${result.pillars.year.zhi} ${result.pillars.month.gan}${result.pillars.month.zhi} ${result.pillars.day.gan}${result.pillars.day.zhi} ${result.pillars.hour.gan}${result.pillars.hour.zhi}\n`);

  const styles: Array<'professional' | 'casual' | 'detailed' | 'concise'> = [
    'professional',
    'casual',
    'detailed',
    'concise'
  ];

  for (const style of styles) {
    console.log(`\n${'='.repeat(40)}`);
    console.log(`风格: ${style}`);
    console.log('='.repeat(40));

    const interpretation = await interpretationService.interpretBazi(
      result,
      '帮我分析一下性格特点',
      style
    );

    console.log(`\n摘要: ${interpretation.summary}\n`);

    // 只显示第一个章节
    if (interpretation.sections.length > 0) {
      const firstSection = interpretation.sections[0];
      console.log(`${firstSection.title}:`);
      console.log(firstSection.content.substring(0, 200) + '...\n');
    }
  }
}

// ==================== 示例4: 错误处理 ====================
async function example4_ErrorHandling() {
  console.log('\n' + '='.repeat(80));
  console.log('示例4: 错误处理演示');
  console.log('='.repeat(80));

  const testCases = [
    '我想算命',  // 信息不完整
    '今天天气怎么样',  // 无关问题
    '帮我看看运势',  // 缺少必要信息
  ];

  for (const input of testCases) {
    console.log(`\n测试输入: "${input}"`);

    try {
      const understanding = await understandingService.understand(input);

      console.log(`  类型: ${understanding.divinationType}`);
      console.log(`  置信度: ${(understanding.confidence * 100).toFixed(0)}%`);

      if (understanding.clarificationNeeded && understanding.clarificationNeeded.length > 0) {
        console.log(`  ⚠️  需要澄清: ${understanding.clarificationNeeded.join(', ')}`);
      }

      const isValid = understandingService.validateUnderstanding(understanding);
      console.log(`  验证: ${isValid ? '✅ 通过' : '❌ 不通过'}`);

    } catch (error) {
      console.error(`  ❌ 错误: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }
}

// ==================== 运行示例 ====================
async function runAllExamples() {
  try {
    // 示例1: 八字排盘完整流程
    await example1_BaziFullFlow();

    // 等待一下，避免 API 限流
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 示例2: 梅花易数失物占
    await example2_MeihuaLostItem();

    // 等待一下
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 示例3: 对比不同风格 (可选，会消耗较多 tokens)
    // await example3_DifferentStyles();

    // 示例4: 错误处理
    await example4_ErrorHandling();

    console.log('\n\n' + '='.repeat(80));
    console.log('✅ 所有示例运行完成!');
    console.log('='.repeat(80));
    console.log('\n💡 提示:');
    console.log('   - 修改 LLM_CONFIG 可以切换不同的 LLM 提供商');
    console.log('   - 解读风格可选: professional, casual, detailed, concise');
    console.log('   - 所有核心计算都是确定性的，LLM 只用于输入理解和结果解读');
    console.log('   - 查看文档: docs/技术参考文档/LLM集成配置指南.md\n');

  } catch (error) {
    console.error('\n❌ 运行出错:', error);

    if (error instanceof Error) {
      if (error.message.includes('API Error')) {
        console.error('\n💡 可能的原因:');
        console.error('   - API Key 无效或已过期');
        console.error('   - API 配额已用完');
        console.error('   - 网络连接问题');
        console.error('   - API 服务暂时不可用\n');
      }
    }

    process.exit(1);
  }
}

// 运行所有示例
runAllExamples();
