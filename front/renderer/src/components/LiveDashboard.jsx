// front/renderer/src/components/LiveDashboard.jsx

import React, { useState, useEffect, useRef } from 'react';
import ScriptEditor from './ScriptEditor.jsx';
import SettingsModal from './SettingsModal.jsx';
import ProductScriptGeneratorModal from './ProductScriptGeneratorModal.jsx';
import ScriptWizardModal from './ScriptWizardModal.jsx';

// 模拟后端返回的模型数据
const MOCK_TTS_MODELS = [
  { id: 'f5tts', name: 'F5TTS (快速)' },
  { id: 'cosyvoice', name: 'CosyVoice (情感丰富)' }
];

const LiveDashboard = () => {
  const [generatedScript, setGeneratedScript] = useState('欢迎来到AI直播间！');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showWizardModal, setShowWizardModal] = useState(false);
  
  // --- 新增高级 TTS 状态 ---
  const [selectedTtsModel, setSelectedTtsModel] = useState('f5tts');
  const [voiceSampleFile, setVoiceSampleFile] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef(null);

  const handleScriptUpdate = (newScript) => {
    setGeneratedScript(newScript);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setVoiceSampleFile(e.target.files[0]);
    }
  };

  const handleSpeak = () => {
    if (!voiceSampleFile) {
      alert('请先选择一个 5-10 秒的目标克隆音色文件！');
      return;
    }
    console.log('--- 开始语音合成推理 ---');
    console.log('文本:', generatedScript);
    console.log('选择的模型:', selectedTtsModel);
    console.log('音色样本:', voiceSampleFile.name);
    // 在真实项目中，这里会调用后端 API
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 3000); // 模拟3秒的合成+播放
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar"><ScriptEditor isLoading={isLoading} /></div>
      <div className="main-content">
        <div className="toolbar" style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
           <div>
              <button onClick={() => setShowProductModal(true)}>+ AI 生成商品稿</button>
              <button onClick={() => setShowWizardModal(true)} style={{marginLeft: '10px'}}>+ AI 脚本向导</button>
           </div>
           <button onClick={() => setShowSettings(true)}>AI 服务设置</button>
        </div>
        
        <h3>当前正在播放的片段内容</h3>
        <textarea className="script-display"  value={generatedScript}  onChange={(e) => setGeneratedScript(e.target.value)} />
        
        <div className="controls" style={{borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '15px'}}>
          <h4>高级语音合成 (TTS)</h4>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap'}}>
              <div>
                <label>语音模型: </label>
                <select value={selectedTtsModel} onChange={(e) => setSelectedTtsModel(e.target.value)}>
                  {MOCK_TTS_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}} />
                <button onClick={() => fileInputRef.current.click()}>选择克隆音色 (5-10s)</button>
                {voiceSampleFile && <span style={{marginLeft: '10px', fontSize: '0.9em'}}>已选择: {voiceSampleFile.name}</span>}
              </div>
              <button onClick={handleSpeak} disabled={isSpeaking || isLoading} className="btn-primary">
                {isSpeaking ? '推理中...' : '开始推理'}
              </button>
          </div>
        </div>
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showProductModal && <ProductScriptGeneratorModal onClose={() => setShowProductModal(false)} onScriptGenerated={handleScriptUpdate} setIsLoading={setIsLoading} />}
      {showWizardModal && <ScriptWizardModal onClose={() => setShowWizardModal(false)} onScriptGenerated={handleScriptUpdate}/>}
    </div>
  );
};
export default LiveDashboard;