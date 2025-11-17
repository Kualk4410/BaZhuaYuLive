// front/renderer/src/components/ModelTrainingPage.jsx

import React, { useState, useEffect, useRef } from 'react';

// 模拟后端返回的模型数据
const MOCK_LOCAL_MODELS = [
  { id: 'chatglm2_6b', name: 'ChatGLM2-6B' },
  { id: 'llama2_7b_chat', name: 'Llama2-7B-Chat' }
];

const ModelTrainingPage = ({ onNavigate }) => {
  const [selectedModel, setSelectedModel] = useState('chatglm2_6b');
  const [trainingFile, setTrainingFile] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // 模拟训练进度的 effect
  useEffect(() => {
    let intervalId;
    if (jobStatus && jobStatus.status === 'running') {
      intervalId = setInterval(() => {
        setJobStatus(prev => {
          const newProgress = Math.min(prev.progress + 0.05, 1);
          if (newProgress >= 1) {
            clearInterval(intervalId);
            return { ...prev, status: 'completed', progress: 1, message: '训练已成功完成！' };
          }
          return { ...prev, progress: newProgress, message: `正在处理数据... (${(newProgress * 100).toFixed(0)}%)` };
        });
      }, 1000); // 每秒更新一次进度
    }
    return () => clearInterval(intervalId);
  }, [jobStatus]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTrainingFile(e.target.files[0]);
    }
  };
  
  const handleStartTraining = () => {
    if (!selectedModel || !trainingFile) {
      alert('请选择一个模型并上传训练样本文件！');
      return;
    }
    console.log('--- 开始一键训练 ---');
    console.log('选择的模型:', selectedModel);
    console.log('训练样本:', trainingFile.name);
    
    // 模拟后端返回的初始状态
    setJobStatus({
      jobId: `train_${Date.now()}`,
      status: 'running',
      progress: 0,
      message: '任务已启动，正在初始化...'
    });
  };

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>本地语言模型训练中心</h1>
        <button onClick={() => onNavigate('dashboard')}>返回主控制台</button>
      </div>
      <hr />
      <div className="form-group">
        <label>1. 选择基础语言模型</label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={isLoading || (jobStatus && jobStatus.status === 'running')}>
          {MOCK_LOCAL_MODELS.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label>2. 上传训练样本 ( .zip )</label>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}} accept=".zip" />
        <button onClick={() => fileInputRef.current.click()} disabled={isLoading || (jobStatus && jobStatus.status === 'running')}>选择文件</button>
        {trainingFile && <span style={{marginLeft: '15px'}}>已选择: {trainingFile.name}</span>}
      </div>
      <button onClick={handleStartTraining} disabled={isLoading || (jobStatus && jobStatus.status === 'running')} className="btn-primary">
        {jobStatus && jobStatus.status === 'running' ? '训练正在进行...' : '开始一键训练'}
      </button>
      {jobStatus && (
        <div style={{marginTop: '30px', padding: '20px', backgroundColor: 'var(--bg-light)', borderRadius: '8px'}}>
          <h3>训练状态</h3>
          <p><strong>状态:</strong> {jobStatus.status}</p>
          <p><strong>信息:</strong> {jobStatus.message}</p>
          <div style={{width: '100%', backgroundColor: '#555', borderRadius: '4px', overflow: 'hidden'}}><div style={{width: `${jobStatus.progress * 100}%`, height: '20px', backgroundColor: 'var(--accent-green)', borderRadius: '4px', transition: 'width 0.5s ease-in-out'}}></div></div>
        </div>
      )}
    </div>
  );
};
export default ModelTrainingPage;