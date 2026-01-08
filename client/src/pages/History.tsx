import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout';
import { Card, Button, Loading } from '../components/common';
import { historyApi } from '../api';
import type { DivinationRecord } from '../types';

const History: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<DivinationRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'bazi' | 'meihua'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecords();
  }, [filter]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const params = filter === 'all' ? {} : { type: filter };
      const data = await historyApi.getList(params);
      setRecords(data.records);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条记录吗？')) return;

    try {
      await historyApi.delete(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || '删除失败');
    }
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const updated = await historyApi.toggleFavorite(id);
      setRecords(records.map(r => (r.id === id ? updated : r)));
    } catch (err: any) {
      alert(err.message || '操作失败');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">历史记录</h1>
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              全部
            </Button>
            <Button
              variant={filter === 'bazi' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('bazi')}
            >
              八字
            </Button>
            <Button
              variant={filter === 'meihua' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('meihua')}
            >
              梅花
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loading size="lg" text="加载中..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadRecords} className="mt-4">
              重试
            </Button>
          </div>
        ) : records.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">暂无记录</p>
              <p className="text-sm text-gray-400">进行占卜后，记录将自动保存在这里</p>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {records.map((record) => (
              <Card key={record.id}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            record.type === 'bazi'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {record.type === 'bazi' ? '八字排盘' : '梅花易数'}
                        </span>
                        {record.isFavorite && (
                          <span className="text-yellow-500">★</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(record.createdAt)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleFavorite(record.id)}
                        className="text-gray-400 hover:text-yellow-500"
                        title={record.isFavorite ? '取消收藏' : '收藏'}
                      >
                        {record.isFavorite ? '★' : '☆'}
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="text-gray-400 hover:text-red-500"
                        title="删除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {record.type === 'bazi' ? (
                      <div>
                        <p className="text-gray-600 mb-2">四柱八字</p>
                        <div className="font-medium">
                          {(record.resultData as any).yearPillar?.gan}
                          {(record.resultData as any).yearPillar?.zhi} |{' '}
                          {(record.resultData as any).monthPillar?.gan}
                          {(record.resultData as any).monthPillar?.zhi} |{' '}
                          {(record.resultData as any).dayPillar?.gan}
                          {(record.resultData as any).dayPillar?.zhi} |{' '}
                          {(record.resultData as any).hourPillar?.gan}
                          {(record.resultData as any).hourPillar?.zhi}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600 mb-2">卦象</p>
                        <div className="font-medium">
                          本卦：{(record.resultData as any).benGua?.name} →{' '}
                          变卦：{(record.resultData as any).bianGua?.name}
                        </div>
                      </div>
                    )}
                  </div>

                  {record.llmInterpretation && (
                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-500 mb-1">AI 解读</p>
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {record.llmInterpretation}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History;
