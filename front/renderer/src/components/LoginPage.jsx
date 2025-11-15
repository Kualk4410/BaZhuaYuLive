// renderer/src/components/LoginPage.jsx
import React, { useState } from 'react';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // --- 模拟登录逻辑 ---
    // 在真实项目中，这里会调用 API 将 username 和 password 发送到后端进行验证
    if (username.trim() !== '' && password.trim() !== '') {
      console.log('登录成功!');
      setError('');
      onLoginSuccess(); // 调用父组件传入的“登录成功”函数
    } else {
      setError('用户名或密码不能为空！');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>AI 直播系统</h2>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button className="btn-login" onClick={handleLogin}>
          登 录
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
