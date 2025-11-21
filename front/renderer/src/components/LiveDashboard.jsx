// front/renderer/src/components/LiveDashboard.jsx (最终完整版)

import React, { useState, useEffect, useRef } from 'react';
import ScriptEditor from './ScriptEditor';
import SettingsModal from './SettingsModal';
import ProductScriptGeneratorModal from './ProductScriptGeneratorModal.jsx'; // 之前的弹窗，暂时保留入口
import ScriptWizardModal from './ScriptWizardModal'; // AI脚本向导弹窗
import PromptSelector from './PromptSelector'; // 新的提示词选择器组件
import { 
  getTtsModels, 
  generatePrompts, 
  generateProductScriptFromPrompt, 
  getScripts, 
  saveScript,
  generateScriptContent // 保留旧的 GPT 智能编写 API
} from '../services/api';
import { useBackendTTS } from '../hooks/useBackendTTS';

const LiveDashboard = () => {
  // --- States ---
  const [productName, setProductName] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [generatedScript, setGeneratedScript] = useState('欢迎来到AI直播间！请在左侧输入或生成您的直播脚本。');
  const [isLoading, setIsLoading] = useState(false);
  const [isAppending, setIsAppending] = useState(false);
  
  // Modal visibility states
  const [showSettings, setShowSettings] = useState(false);

  // TTS related states
  const [ttsModels, setTtsModels] = useState([]);
  const [selectedTtsModel, setSelectedTtsModel] = useState('');
  const [voiceSampleFile, setVoiceSampleFile] = useState(null);
  const voiceFileInputRef = useRef(null);
  const { isSpeaking, error: ttsError, speak, stop } = useBackendTTS();

  // --- Effects ---
  // 组件加载时，获取TTS模型列表
  useEffect(() => {
    // --- 使用模拟数据以防止启动时因后端接口未就绪而报错 ---
    console.log("后端 /api/models/tts 接口尚未实现，使用前端模拟数据。");
    const MOCK_TTS_MODELS = [
      { id: 'f5tts', name: 'F5TTS (快速)' },
      { id: 'cosyvoice', name: 'CosyVoice (情感丰富)' }
    ];
    setTtsModels(MOCK_TTS_MODELS);
    if (MOCK_TTS_MODELS.length > 0) {
      setSelectedTtsModel(MOCK_TTS_MODELS[0].id);
    }
  }, []);

  // --- Handlers ---
  const handleFetchPrompts = async () => {
    if (!productName) { alert('请输入商品名称！'); return; }
    setIsLoading(true);
    try {
      // 模拟后端返回提示词
      console.log(`向后端发送商品名: ${productName} 以获取提示词 (模拟)`);
      const data = { prompts: ["突出性价比", "强调材质优点", "适合送礼场景", "限时优惠活动"] };
      setPrompts(data.prompts || []);
    } catch (error) {
      alert(`获取提示词失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateScript = async () => {
    if (!productName) { alert('商品名称不能为空！'); return; }
    setIsLoading(true);
    try {
      // 模拟后端根据提示词生成脚本
      console.log(`向后端发送商品名: ${productName} 和提示词: ${selectedPrompts.join(', ')} (模拟)`);
      const data = { scriptContent: `家人们，今天这款【${productName}】绝对是重头戏！我们特别${selectedPrompts.join('，')}，保证您买到就是赚到！` };
      if (isAppending) {
        setGeneratedScript(prev => `${prev}\n\n${data.scriptContent}`);
      } else {
        setGeneratedScript(data.scriptContent);
      }
    } catch (error) {
      alert(`生成脚本失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!selectedTtsModel) { alert('请选择语音模型！'); return; }
    if (!generatedScript) { alert('脚本内容不能为空！'); return; }
    if (!voiceSampleFile) { alert('请选择一个 5-10s 的目标克隆音色文件！'); return; }
    
    console.log('--- 准备进行高级语音合成 (模拟) ---');
    console.log('发送给后端的文本:', generatedScript);
    console.log('选择的语音模型:', selectedTtsModel);
    console.log('选择的音色样本:', voiceSampleFile.name);
    alert('功能演示：已在开发者工具 Console 中打印请求参数，后端语音克隆接口待实现。');
    // 真实调用: speak(generatedScript, selectedTtsModel, voiceSampleFile);
  };
  
  // --- Render ---
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* 左侧的脚本保存/管理功能区 */}
        <ScriptEditor isLoading={isLoading} />
      </div>

      <div className="main-content">
        <div className="product-generator-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px', marginBottom: '20px' }}>
          <h3>AI 生成商品稿</h3>
          <div className="form-group">
            <label>1. 输入商品名称</label>
            <div style={{display: 'flex', gap: '10px'}}>
              <input 
                type="text" 
                value={productName} 
                onChange={(e) => setProductName(e.target.value)} 
                placeholder="例如：新款智能降噪耳机"
                style={{flexGrow: 1}}
              />
              <button onClick={handleFetchPrompts} disabled={isLoading}>
                {isLoading ? '...' : '获取AI提示词'}
              </button>
            </div>
          </div>
          
          <PromptSelector 
            prompts={prompts} 
            selectedPrompts={selectedPrompts}
            onSelectionChange={setSelectedPrompts}
          />

          <div className="form-group" style={{marginTop: '15px'}}>
            <label>3. 生成最终脚本</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
              <button onClick={handleGenerateScript} disabled={isLoading} className="btn-primary">
                {isLoading ? '生成中...' : '生成口播稿'}
              </button>
              <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={isAppending} 
                  onChange={(e) => setIsAppending(e.target.checked)} 
                  style={{marginRight: '5px'}}
                />
                追加到当前脚本末尾
              </label>
            </div>
          </div>
        </div>

        <h3>当前口播内容 (可直接编辑)</h3>
        <textarea 
          className="script-display" 
          value={generatedScript} 
          onChange={(e) => setGeneratedScript(e.target.value)}
        />
        
        <div className="controls" style={{borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '20px'}}>
          <h4>高级语音合成 (含音色克隆)</h4>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
            <span>语音模型:</span>
            <select 
              value={selectedTtsModel} 
              onChange={(e) => setSelectedTtsModel(e.target.value)}
              disabled={isSpeaking}
              style={{padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-light)', border: '1px solid var(--border-color)', color: 'var(--text-light)'}}
            >
              {ttsModels.map(model => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>

            <input 
              type="file" 
              accept="audio/*" 
              ref={voiceFileInputRef} 
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setVoiceSampleFile(e.target.files[0]);
                }
              }} 
              style={{display: 'none'}} 
            />
            <button onClick={() => voiceFileInputRef.current.click()} disabled={isSpeaking}>
              选择克隆音色 (5-10s)
            </button>
            {voiceSampleFile && <span style={{fontSize: '0.9em', color: 'var(--text-muted)'}}>已选: {voiceSampleFile.name}</span>}

            <button 
              onClick={handleSpeak} 
              disabled={isSpeaking || isLoading || !generatedScript} 
              className="btn-primary"
            >
              {isSpeaking ? '生成中...' : '开始朗读'}
            </button>

            <button onClick={stop} disabled={!isSpeaking}>停止朗读</button>
          </div>
          {ttsError && <p style={{color: 'red', marginTop: '10px'}}>{ttsError}</p>}
        </div>
      </div>
      
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default LiveDashboard;