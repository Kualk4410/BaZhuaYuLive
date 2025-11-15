// src/components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { saveUserSettings } from '../services/api';

const SettingsModal = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('https://api.openai.com/v1');
  const [model, setModel] = useState('gpt-4');

  // 组件加载时尝试从钥匙串读取已保存的 key
  useEffect(() => {
    const loadApiKey = async () => {
      // window.electron 是通过 preload.js 暴露的
      const storedKey = await window.electron.keychain.getApiKey();
      if (storedKey) {
        setApiKey(storedKey);
      }
    };
    loadApiKey();
  }, []);

  const handleSave = async () => {
    try {
      // 1. 将 API Key 安全存入系统钥匙串
      await window.electron.keychain.setApiKey(apiKey);

      // 2. 将其他非敏感设置保存到后端
      await saveUserSettings({ apiBaseUrl, model });

      alert('设置已保存！');
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('保存失败，请查看控制台日志。');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>AI 服务设置</h2>

        <label>API 地址:</label>
        <input
          type="text"
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
        />

        <label>API Key:</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="从系统钥匙串加载..."
        />

        <label>GPT 模型:</label>
        <select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5-Turbo</option>
          {/* 可以根据后端支持情况添加更多模型 */}
        </select>

        <div className="modal-actions">
          <button onClick={handleSave}>保存</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;