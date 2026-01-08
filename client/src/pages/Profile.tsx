import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout';
import { Card } from '../components/common';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">请先登录</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">个人中心</h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-indigo-600">
                    {user.nickname?.[0] || user.username[0]}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  {user.nickname || user.username}
                </h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card title="基本信息">
              <div className="space-y-4">
                <div className="grid grid-cols-3 py-3 border-b">
                  <span className="text-gray-600">用户名</span>
                  <span className="col-span-2 font-medium">{user.username}</span>
                </div>
                <div className="grid grid-cols-3 py-3 border-b">
                  <span className="text-gray-600">邮箱</span>
                  <span className="col-span-2 font-medium">{user.email}</span>
                </div>
                <div className="grid grid-cols-3 py-3 border-b">
                  <span className="text-gray-600">昵称</span>
                  <span className="col-span-2 font-medium">
                    {user.nickname || '未设置'}
                  </span>
                </div>
                <div className="grid grid-cols-3 py-3 border-b">
                  <span className="text-gray-600">注册时间</span>
                  <span className="col-span-2 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="统计信息" className="mt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">-</div>
                  <div className="text-sm text-gray-600 mt-1">八字排盘</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">-</div>
                  <div className="text-sm text-gray-600 mt-1">梅花易数</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">-</div>
                  <div className="text-sm text-gray-600 mt-1">收藏记录</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
