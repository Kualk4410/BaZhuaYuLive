// front/renderer/src/components/LiveDashboard.jsx

import React, { useState, useRef } from 'react';
import ScriptEditor from './ScriptEditor';
import ProductScriptGeneratorModal from './ProductScriptGeneratorModal.jsx';
// ... 其他您可能有的弹窗 import

const LiveDashboard = () => {
  const [generatedScript, setGeneratedScript] = useState('欢迎来到AI直播间！...');
  const [isLoading, setIsLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);

  // --- 全新的高级 TTS 状态 ---
  const [ttsModels, setTtsModels] = useState([ // 模拟的 TTS 模型列表
    { id: 'f5tts', name: 'F5TTS (快速)' },
    { id: 'cosyvoice', name: 'CosyVoice (情感丰富)' }
  ]);
  const [selectedTtsModel, setSelectedTtsModel] = useState('f5tts');
  const [voiceSampleFile, setVoiceSampleFile] = useState(null);
  const voiceFileInputRef = useRef(null);

  const handleScriptUpdate = (newScript) => {
    setGeneratedScript(newScript);
  };

  const handleVoiceFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setVoiceSampleFile(e.target.files[0]);
    }
  };

  const handleAdvancedSpeak = () => {
    if (!generatedScript) { alert('脚本内容不能为空！'); return; }
    if (!selectedTtsModel) { alert('请选择一个语音模型！'); return; }
    if (!voiceSampleFile) { alert('请选择一个 5-10s 的目标克隆音色文件！'); return; }
    
    // --- 这里是模拟调用 ---
    console.log('--- 准备进行高级语音合成 ---');
    console.log('发送给后端的文本:', generatedScript);
    console.log('选择的语音模型:', selectedTtsModel);
    console.log('选择的音色样本:', voiceSampleFile.name);
    alert('功能演示：已在开发者工具 Console 中打印请求参数，后端接口待实现。');
    // 在真实实现中，这里会调用 api.js 中的新函数，例如:
    // generateClonedSpeech(generatedScript, selectedTtsModel, voiceSampleFile);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <ScriptEditor onGenerate={() => {}} isLoading={isLoading} />
      </div>

      <div className="main-content">
        <div className="toolbar">
          <button onClick={() => setShowProductModal(true)}>+ AI 生成商品稿</button>
          {/* 其他按钮... */}
        </div>
        
        <h3>当前正在播放的片段内容</h3>
        <textarea className="script-display" value={generatedScript} readOnly />
        
        <div className="controls" style={{borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '15px'}}>
          <h4>高级语音合成 (含音色克隆)</h4>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
            <span>语音模型:</span>
            <select value={selectedTtsModel} onChange={(e) => setSelectedTtsModel(e.target.value)}>
              {ttsModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>

            <input type="file" accept="audio/*" ref={voiceFileInputRef} onChange={handleVoiceFileChange} style={{display: 'none'}} />
            <button onClick={() => voiceFileInputRef.current.click()}>选择克隆音色 (5-10s)</button>
            {voiceSampleFile && <span>已选择: {voiceSampleFile.name}</span>}

            <button onClick={handleAdvancedSpeak} className="btn-primary">生成并朗读</button>
          </div>
        </div>
      </div>

      {showProductModal && (
        <ProductScriptGeneratorModal 
          onClose={() => setShowProductModal(false)}
          onScriptGenerated={handleScriptUpdate}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default LiveDashboard;