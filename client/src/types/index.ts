// 用户相关类型
export interface User {
  id: number;
  username: string;
  email: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nickname?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// 八字排盘相关类型
export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
  name?: string;
}

export interface Pillar {
  gan: string;
  zhi: string;
}

export interface BaziResult {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  solarDate: string;
  lunarDate: string;
  age: number;
  gender: string;
  dayGanWuxing: string;
  mingju: string;
}

// 梅花易数相关类型
export interface MeihuaInput {
  type: 'time' | 'number' | 'chars';
  chars?: string;
  upperNumber?: number;
  lowerNumber?: number;
  changeNumber?: number;
}

export interface Gua {
  name: string;
  symbol: string;
  number: number;
  wuxing: string;
  nature: string;
}

export interface MeihuaResult {
  benGua: Gua;
  bianGua: Gua;
  dongYao: number;
  huGua?: Gua;
  cuoGua?: Gua;
  zongGua?: Gua;
  timestamp: string;
  inputMethod: string;
}

// 占卜记录相关类型
export interface DivinationRecord {
  id: number;
  userId: number;
  type: 'bazi' | 'meihua';
  inputData: BaziInput | MeihuaInput;
  resultData: BaziResult | MeihuaResult;
  llmInterpretation?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DivinationListResponse {
  records: DivinationRecord[];
  total: number;
  page: number;
  pageSize: number;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 分页参数
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  type?: 'bazi' | 'meihua';
  startDate?: string;
  endDate?: string;
}
