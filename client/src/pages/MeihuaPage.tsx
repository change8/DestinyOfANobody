import React, { useState } from 'react';
import { Layout } from '../components/layout';
import { Card, Button, Input } from '../components/common';
import { divinationApi } from '../api';
import type { MeihuaInput, MeihuaResult } from '../types';

const MeihuaPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<MeihuaResult | null>(null);
  const [method, setMethod] = useState<'time' | 'number' | 'chars'>('time');
  const [formData, setFormData] = useState({
    chars: '',
    upperNumber: '',
    lowerNumber: '',
    changeNumber: '',
  });

  const handleMethodChange = (newMethod: 'time' | 'number' | 'chars') => {
    setMethod(newMethod);
    setFormData({
      chars: '',
      upperNumber: '',
      lowerNumber: '',
      changeNumber: '',
    });
    setError('');
    setResult(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let input: MeihuaInput;

      if (method === 'time') {
        input = { type: 'time' };
      } else if (method === 'number') {
        const upper = parseInt(formData.upperNumber);
        const lower = parseInt(formData.lowerNumber);
        const change = parseInt(formData.changeNumber);

        if (isNaN(upper) || isNaN(lower) || isNaN(change)) {
          throw new Error('请输入有效的数字');
        }

        input = {
          type: 'number',
          upperNumber: upper,
          lowerNumber: lower,
          changeNumber: change,
        };
      } else {
        if (!formData.chars.trim()) {
          throw new Error('请输入文字');
        }
        input = {
          type: 'chars',
          chars: formData.chars.trim(),
        };
      }

      const data = await divinationApi.meihua(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || '起卦失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError('');
    setFormData({
      chars: '',
      upperNumber: '',
      lowerNumber: '',
      changeNumber: '',
    });
  };

  const renderGuaCard = (title: string, gua: any) => (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <div className="text-center space-y-3">
        <div className="text-3xl font-bold text-indigo-600">{gua.name}</div>
        <div className="text-xl">{gua.symbol}</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white p-2 rounded">
            <div className="text-gray-600">卦数</div>
            <div className="font-semibold">{gua.number}</div>
          </div>
          <div className="bg-white p-2 rounded">
            <div className="text-gray-600">五行</div>
            <div className="font-semibold">{gua.wuxing}</div>
          </div>
        </div>
        <div className="bg-white p-3 rounded text-sm">
          <div className="text-gray-600 mb-1">卦性</div>
          <div>{gua.nature}</div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">梅花易数</h1>
          <p className="text-gray-600">选择起卦方式，探索事物发展趋势</p>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* 起卦方式选择 */}
            <Card>
              <div className="flex justify-center space-x-4 mb-6">
                <Button
                  variant={method === 'time' ? 'primary' : 'outline'}
                  onClick={() => handleMethodChange('time')}
                >
                  时间起卦
                </Button>
                <Button
                  variant={method === 'number' ? 'primary' : 'outline'}
                  onClick={() => handleMethodChange('number')}
                >
                  数字起卦
                </Button>
                <Button
                  variant={method === 'chars' ? 'primary' : 'outline'}
                  onClick={() => handleMethodChange('chars')}
                >
                  文字起卦
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {method === 'time' && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      系统将使用当前时间起卦，点击下方按钮开始
                    </p>
                    <div className="text-2xl font-semibold text-indigo-600">
                      {new Date().toLocaleString('zh-CN')}
                    </div>
                  </div>
                )}

                {method === 'number' && (
                  <div className="space-y-4">
                    <div className="text-center text-sm text-gray-600 mb-4">
                      请输入三个数字（1-8），分别代表上卦、下卦和动爻
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Input
                        label="上卦数"
                        type="number"
                        name="upperNumber"
                        value={formData.upperNumber}
                        onChange={handleChange}
                        min="1"
                        max="8"
                        required
                        placeholder="1-8"
                      />
                      <Input
                        label="下卦数"
                        type="number"
                        name="lowerNumber"
                        value={formData.lowerNumber}
                        onChange={handleChange}
                        min="1"
                        max="8"
                        required
                        placeholder="1-8"
                      />
                      <Input
                        label="动爻数"
                        type="number"
                        name="changeNumber"
                        value={formData.changeNumber}
                        onChange={handleChange}
                        min="1"
                        max="6"
                        required
                        placeholder="1-6"
                      />
                    </div>
                  </div>
                )}

                {method === 'chars' && (
                  <div>
                    <Input
                      label="请输入文字"
                      type="text"
                      name="chars"
                      value={formData.chars}
                      onChange={handleChange}
                      required
                      placeholder="输入任意文字，系统将根据字数和笔画起卦"
                      helperText="可以是问题、姓名或任意汉字"
                    />
                  </div>
                )}

                <div className="flex justify-center">
                  <Button type="submit" loading={loading} size="lg">
                    开始起卦
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card title="卦象信息">
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {renderGuaCard('本卦', result.benGua)}
                {renderGuaCard('变卦', result.bianGua)}
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">动爻</div>
                <div className="text-2xl font-bold text-yellow-700">第 {result.dongYao} 爻</div>
              </div>
            </Card>

            {result.huGua && (
              <Card title="互卦">
                <div className="max-w-md mx-auto">
                  {renderGuaCard('互卦', result.huGua)}
                </div>
              </Card>
            )}

            <Card title="起卦信息">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">起卦方式：</span>
                  <span className="font-medium">{result.inputMethod}</span>
                </div>
                <div>
                  <span className="text-gray-600">起卦时间：</span>
                  <span className="font-medium">
                    {new Date(result.timestamp).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={resetForm}>重新起卦</Button>
              <Button variant="outline">保存结果</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MeihuaPage;
