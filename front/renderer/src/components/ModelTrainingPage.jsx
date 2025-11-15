// front/renderer/src/components/ModelTrainingPage.jsx

import React, { useState, useRef } from 'react';

const ModelTrainingPage = ({ onNavigate }) => {
  const [models, setModels] = useState([ // 模拟的本地模型列表
    { id: 'chatglm2_6b', name: 'ChatGLM2-6B' },
    { id: 'llama2_7b_chat', name: 'Llama2-7B-Chat' }
  ]);
  const [selectedModel, setSelectedModel] = useState('chatglm2_6b');
  const [trainingFile, setTrainingFile] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setTrainingFile(e.target.files[0]);
    }
  };
  
  const handleStartTraining = () => {
    if (!selectedModel) { alert('请选择一个基础语言模型！'); return; }
    if (!trainingFile) { alert('请上传训练样本文件！'); return; }
    
    // --- 这里是模拟调用 ---
    console.log('--- 准备开始一键训练 ---');
    console.log('选择的基础模型:', selectedModel);
    console.log('上传的训练样本:', trainingFile.name);
    alert('功能演示：已在开发者工具 Console 中打印请求参数，并开始模拟训练进度。');
    
    // 模拟后端返回的任务状态
    setJobStatus({
      jobId: `train_task_${Date.now()}`,
      status: 'queued',
      progress: 0,
      message: '任务已加入队列，等待调度...'
    });

    // 模拟训练过程
    setTimeout(() => setJobStatus(prev => ({ ...prev, status: 'running', progress: 0.1, message: '正在预处理数据...' })), 3000);
    setTimeout(() => setJobStatus(prev => ({ ...prev, progress: 0.4, message: 'Epoch 1/3 ...' })), 8000);
    setTimeout(() => setJobStatus(prev => ({ ...prev, progress: 0.8, message: 'Epoch 2/3 ...' })), 15000);
    setTimeout(() => setJobStatus(prev => ({ ...prev, status: 'completed', progress: 1, message: '训练成功完成！' })), 20000);
  };

  return (
    <div style={{ padding: '20px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>本地语言模型一键训练</h1>
        <button onClick={() => onNavigate('dashboard')}>返回主控制台</button>
      </div>
      <hr />

      <div className="form-group">
        <label>1. 选择基础语言模型</label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
          {models.map(model => (
            <option key={model.id} value={model.id}>{model.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>2. 上传训练样本 (支持 .zip 等)</label>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}} />
        <button onClick={() => fileInputRef.current.click()}>选择文件</button>
        {trainingFile && <span style={{marginLeft: '15px'}}>已选择: {trainingFile.name}</span>}
      </div>

      <button onClick={handleStartTraining} disabled={jobStatus && jobStatus.status === 'running'}>
        {jobStatus && jobStatus.status === 'running' ? '训练正在进行...' : '开始一键训练'}
      </button>
      
      {jobStatus && (
        <div style={{marginTop: '30px', padding: '20px', backgroundColor: 'var(--bg-light)', borderRadius: '8px'}}>
          <h3>训练状态</h3>
          <p><strong>任务ID:</strong> {jobStatus.jobId}</p>
          <p><strong>状态:</strong> {jobStatus.status}</p>
          <p><strong>进度:</strong> {`${(jobStatus.progress * 100).toFixed(0)}%`}</p>
          <p><strong>信息:</strong> {jobStatus.message}</p>
          <div style={{width: '100%', backgroundColor: '#555', borderRadius: '4px', overflow: 'hidden'}}><div style={{width: `${jobStatus.progress * 100}%`, height: '20px', backgroundColor: 'var(--accent-green)', borderRadius: '4px', transition: 'width 0.5s ease-in-out'}}></div></div>
        </div>
      )}
    </div>
  );
};

export default ModelTrainingPage;