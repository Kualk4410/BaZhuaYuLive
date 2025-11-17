// renderer/src/App.jsx
import LoginPage from "./components/LoginPage.jsx";
import React, { useState, useEffect } from 'react';
import LiveDashboard from './components/LiveDashboard';
import ModelTrainingPage from './components/ModelTrainingPage'; // 1. 引入新页面

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 登录状态
  const [currentPage, setCurrentPage] = useState('dashboard'); // 2. 页面路由状态

  // 3. 设置一个 Effect 来监听从主进程发来的导航消息
  useEffect(() => {
    // window.electron 是通过 preload.js 暴露的
    if (window.electron && window.electron.receive) {
      window.electron.receive('navigate', (page) => {
        console.log(`收到导航请求，跳转到: ${page}`);
        setCurrentPage(page);
      });
    }
  }, []); // 空依赖数组表示只在组件加载时设置一次监听

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // 4. 定义一个渲染内容的函数，根据状态决定显示什么
  const renderContent = () => {
    if (!isLoggedIn) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }
    
    // 登录后，根据 currentPage 状态来切换页面
    switch (currentPage) {
      case 'model-training':
        return <ModelTrainingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
      default:
        return <LiveDashboard />;
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;