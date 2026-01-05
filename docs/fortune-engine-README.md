# Fortune Engine - 传统易经八字算命引擎

> 精准的四柱排盘和命理分析引擎，基于传统命理学经典编写

## 特性

- ✅ **精准计算**：基于《渊海子平》《三命通会》等经典著作
- ✅ **完整功能**：四柱、十神、纳音、藏干、五行、大运、流年
- ✅ **类型安全**：完整的TypeScript类型定义
- ✅ **零依赖**：仅依赖 dayjs，无其他外部依赖
- ✅ **易于使用**：简洁的API设计
- ✅ **高性能**：单次排盘 < 100ms

## 安装

```bash
npm install @destiny/fortune-engine
```

## 快速开始

```typescript
import { calculate } from '@destiny/fortune-engine';

// 计算八字排盘
const result = calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'male'
});

// 查看四柱
console.log('年柱：', result.pillars.year.gan + result.pillars.year.zhi);
console.log('月柱：', result.pillars.month.gan + result.pillars.month.zhi);
console.log('日柱：', result.pillars.day.gan + result.pillars.day.zhi);
console.log('时柱：', result.pillars.hour.gan + result.pillars.hour.zhi);

// 查看十神
console.log('十神：', result.shishen);

// 查看五行
console.log('五行：', result.wuxing);
```

## 高级选项

### 真太阳时修正

```typescript
const result = calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'male',
  options: {
    useTrueSolarTime: true,  // 启用真太阳时
    longitude: 116.4074      // 北京经度
  }
});
```

### 子时处理方式

```typescript
const result = calculate({
  birthDate: '1990-01-01',
  birthTime: '23:30',  // 子时
  gender: 'male',
  options: {
    ziShiMethod: 'traditional'  // 'traditional' | 'modern'
  }
});
```

## API文档

### calculate(input: BaziInput): BaziResult

主计算函数，返回完整的八字排盘结果。

**参数：**

```typescript
interface BaziInput {
  birthDate: string | Date;  // 出生日期 'YYYY-MM-DD'
  birthTime: string;         // 出生时间 'HH:mm'
  gender: 'male' | 'female'; // 性别
  name?: string;             // 姓名（可选）
  options?: {
    timezone?: number;            // 时区，默认8
    useTrueSolarTime?: boolean;   // 是否使用真太阳时
    longitude?: number;            // 经度
    ziShiMethod?: 'traditional' | 'modern';  // 子时处理方式
  };
}
```

**返回值：**

```typescript
interface BaziResult {
  input: {...};           // 输入信息
  lunar: {...};           // 农历信息
  pillars: {              // 四柱
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour: Pillar;
  };
  shishen: {...};         // 十神
  nayin: {...};           // 纳音
  canggan: {...};         // 藏干
  wuxing: {               // 五行分析
    count: {...};         // 五行个数
    strength: {...};      // 五行力量
    dayMasterWuxing: string;      // 日主五行
    dayMasterStrength: string;    // 日主强弱
    xiyongshen: string;   // 喜用神
    jishen: string;       // 忌神
  };
  dayun: Dayun[];         // 大运
  liunian: Liunian[];     // 流年
  metadata: {...};        // 元数据
}
```

## 完整示例

```typescript
import { calculate, BaziCalculator } from '@destiny/fortune-engine';

// 方式1：使用快捷函数
const result1 = calculate({
  birthDate: '1990-01-01',
  birthTime: '12:30',
  gender: 'male',
  name: '张三'
});

// 方式2：使用类
const calculator = new BaziCalculator();
const result2 = calculator.calculate({
  birthDate: new Date(1990, 0, 1),
  birthTime: '12:30',
  gender: 'female'
});

// 输出完整结果
console.log(JSON.stringify(result1, null, 2));
```

## 注意事项

1. **日期范围**：支持1900-2100年
2. **时间格式**：必须为 HH:mm 格式（24小时制）
3. **立春判断**：年柱以立春为界，不是1月1日
4. **节气判断**：月柱以节气为界，不是公历月份
5. **子时处理**：23:00-01:00为子时，可选择是否算第二天

## 理论基础

本引擎基于以下经典著作编写：
- 《渊海子平》（宋·徐大升）
- 《三命通会》（明·万民英）
- 《子平真诠》（清·沈孝瞻）
- 《滴天髓》（清·刘基）

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 测试
npm test

# 代码检查
npm run lint
```

## 许可证

MIT

## 免责声明

本项目仅供学习交流使用，算命结果仅供参考，不构成任何人生决策建议。请理性对待命理文化，不要过度迷信。
