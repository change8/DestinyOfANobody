import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Card, Button, Input } from '../components/common';
import { divinationApi } from '../api';
import type { BaziInput, BaziResult } from '../types';

const BaziPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<BaziResult | null>(null);
  const [formData, setFormData] = useState<BaziInput>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    gender: 'male',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'year' || name === 'month' || name === 'day' || name === 'hour' || name === 'minute'
        ? parseInt(value)
        : value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await divinationApi.bazi(formData);
      setResult(data);
    } catch (err: any) {
      setError(err.message || '计算失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError('');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">八字排盘</h1>
          <p className="text-gray-600">请输入出生信息，系统将为您排列四柱八字</p>
        </div>

        {!result ? (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="姓名（可选）"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="请输入姓名"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    性别
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Input
                  label="出生年份"
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1900"
                  max="2100"
                  required
                />

                <Input
                  label="出生月份"
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  required
                />

                <Input
                  label="出生日期"
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="出生时辰（小时）"
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  min="0"
                  max="23"
                  required
                  helperText="24小时制，例如：14表示下午2点"
                />

                <Input
                  label="出生分钟"
                  type="number"
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  required
                />
              </div>

              <div className="flex justify-center">
                <Button type="submit" loading={loading} size="lg">
                  开始排盘
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card title="八字信息">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {formData.name && (
                    <div>
                      <span className="text-gray-600">姓名：</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">性别：</span>
                    <span className="font-medium">{result.gender}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">公历：</span>
                    <span className="font-medium">{result.solarDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">农历：</span>
                    <span className="font-medium">{result.lunarDate}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="四柱八字">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">年柱</div>
                  <div className="text-2xl font-bold text-red-600">
                    {result.yearPillar.gan}{result.yearPillar.zhi}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">月柱</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.monthPillar.gan}{result.monthPillar.zhi}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">日柱</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.dayPillar.gan}{result.dayPillar.zhi}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">时柱</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {result.hourPillar.gan}{result.hourPillar.zhi}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="命理信息">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">日元五行</div>
                  <div className="text-xl font-semibold">{result.dayGanWuxing}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">命局</div>
                  <div className="text-xl font-semibold">{result.mingju}</div>
                </div>
              </div>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={resetForm}>重新排盘</Button>
              <Button variant="outline">保存结果</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BaziPage;
