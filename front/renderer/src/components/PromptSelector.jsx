// front/renderer/src/components/PromptSelector.jsx
import React from 'react';

const PromptSelector = ({ prompts, selectedPrompts, onSelectionChange }) => {
  if (prompts.length === 0) {
    return <p style={{color: 'var(--text-muted)'}}>输入商品名称后，点击按钮获取AI生成的描述提示词。</p>;
  }

  const handleTogglePrompt = (prompt) => {
    if (selectedPrompts.includes(prompt)) {
      onSelectionChange(selectedPrompts.filter(p => p !== prompt));
    } else {
      onSelectionChange([...selectedPrompts, prompt]);
    }
  };

  return (
    <div className="form-group">
      <label>2. 选择您希望包含的描述 (选填，可多选)</label>
      <div className="prompt-list" style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px'}}>
        {prompts.map((prompt, index) => {
          const isSelected = selectedPrompts.includes(prompt);
          return (
            <div 
              key={index}
              onClick={() => handleTogglePrompt(prompt)}
              style={{
                padding: '8px 12px',
                border: `1px solid ${isSelected ? 'var(--accent-green)' : 'var(--border-color)'}`,
                borderRadius: '20px',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'rgba(87, 242, 135, 0.2)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {prompt}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromptSelector;