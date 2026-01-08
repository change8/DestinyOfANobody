import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout';
import { Card, Button } from '../components/common';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* 主标题区域 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">命运之卦</h1>
          <p className="text-xl text-gray-600 mb-2">探索中国传统命理的奥秘</p>
          <p className="text-gray-500">结合现代AI技术，为您提供专业的命理解读服务</p>
        </div>

        {/* 功能卡片 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">八</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">八字排盘</h3>
              <p className="text-gray-600 mb-6">
                基于出生年月日时，精准排列四柱八字，分析命理格局
              </p>
              <Link to="/bazi">
                <Button>立即测算</Button>
              </Link>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">卦</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">梅花易数</h3>
              <p className="text-gray-600 mb-6">
                运用梅花易数起卦方法，解读事物发展趋势与吉凶
              </p>
              <Link to="/meihua">
                <Button>开始占卜</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* 特色功能 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">AI 智能解读</h2>
            <p className="text-lg mb-6">
              我们结合大语言模型技术，为您提供更加详细、易懂的命理解读
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-sm">准确率</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10000+</div>
                <div className="text-sm">用户信赖</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm">随时服务</div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用流程 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">简单三步，了解命运</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">选择功能</h3>
              <p className="text-gray-600">选择八字排盘或梅花易数</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">输入信息</h3>
              <p className="text-gray-600">填写出生信息或起卦条件</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">获取解读</h3>
              <p className="text-gray-600">查看详细的命理分析结果</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
