// renderer/src/components/ScriptWizardModal.jsx
import React, { useState, useEffect } from 'react';
import { refineScript } from '../services/api'; // 稍后添加

const ScriptWizardModal = ({ onClose, onScriptGenerated }) => {
  const [step, setStep] = useState(1);
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async (action) => {
    setIsLoading(true);
    try {
      const currentText = step === 1 ? prompt : text;
      const data = await refineScript({ currentText, action, step });
      setText(data.refinedText);
      setStep(data.nextStep);
      setOptions(data.availableActions || []);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    onScriptGenerated(text);
    onClose();
  };
  
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>AI 脚本生成向导 - 第 {step} 步</h2>
        {step === 1 && (
          <div className="form-group">
            <label>请输入您的核心提示词</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} />
          </div>
        )}
        {step > 1 && (
          <div className="form-group">
            <label>AI 生成的脚本草稿</label>
            <textarea value={text} readOnly rows={10} />
          </div>
        )}
        <div className="modal-actions">
          {step === 1 && <button onClick={() => handleNext('generate_draft')} disabled={isLoading}>生成草稿</button>}
          {step === 2 && (
            <>
              {options.map(opt => <button key={opt} onClick={() => handleNext(opt)} disabled={isLoading}>{opt === 'correct_grammar' ? '语法修正' : '50字一段'}</button>)}
              <button onClick={handleFinish} className="btn-primary" disabled={isLoading}>完成</button>
            </>
          )}
        </div>
        <button onClick={onClose} style={{marginTop: '10px'}}>关闭</button>
      </div>
    </div>
  );
};

export default ScriptWizardModal;