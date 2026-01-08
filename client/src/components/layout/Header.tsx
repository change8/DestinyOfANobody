import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">命</span>
            </div>
            <span className="text-xl font-bold text-gray-900">命运之卦</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
              首页
            </Link>
            <Link to="/bazi" className="text-gray-700 hover:text-indigo-600 transition-colors">
              八字排盘
            </Link>
            <Link to="/meihua" className="text-gray-700 hover:text-indigo-600 transition-colors">
              梅花易数
            </Link>
            {isAuthenticated && (
              <Link to="/history" className="text-gray-700 hover:text-indigo-600 transition-colors">
                历史记录
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    {user?.nickname || user?.username}
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  退出
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    登录
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    注册
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
