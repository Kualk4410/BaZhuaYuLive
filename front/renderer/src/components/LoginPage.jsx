// front/renderer/src/components/LoginPage.jsx
import React, { useState } from 'react';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username.trim() !== '' && password.trim() !== '') {
      onLoginSuccess();
    } else {
      setError('用户名或密码不能为空！');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>AI 直播系统</h2>
        <div className="form-group"><label>用户名</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></div>
        <div className="form-group"><label>密码</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {error && <p className="login-error">{error}</p>}
        <button className="btn-login" onClick={handleLogin}>登 录</button>
      </div>
    </div>
  );
};

export default LoginPage;