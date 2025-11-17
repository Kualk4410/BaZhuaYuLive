// front/renderer/src/components/ProductScriptGeneratorModal.jsx
import React, { useState } from 'react';
import { generateScriptContent } from '../services/api'; // 我们将复用这个已有的函数

const ProductScriptGeneratorModal = ({ onClose, onScriptGenerated, setIsLoading }) => {
  const [formData, setFormData] = useState({ productName: '', features: '', targetAudience: '', price: '', promotion: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.productName) {
      alert('产品名称不能为空！');
      return;
    }
    setIsLoading(true);
    try {
      // --- 核心修改：将表单数据格式化为后端需要的 user_prompt ---
      const user_prompt = `
        请根据以下产品信息，为我生成一段专业的、吸引人的直播口播稿：
        - 产品名称: ${formData.productName}
        - 核心卖点: ${formData.features}
        - 目标用户: ${formData.targetAudience}
        - 价格: ${formData.price}
        - 优惠活动: ${formData.promotion}
        请直接返回生成的口播稿内容，不要包含其他解释性文字。
      `;
      
      // 复用 generateScriptContent，因为它已经正确配置为调用后端的 single_chat 接口
      const responseData = await generateScriptContent({ content: user_prompt });
      
      onScriptGenerated(responseData); // 后端直接返回文本，我们直接使用
      onClose();
    } catch (error) {
      alert(`生成失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{width: '600px'}}>
        <h2>AI 生成产品口播稿</h2>
        <div className="form-group"><label>产品名称*</label><input type="text" name="productName" value={formData.productName} onChange={handleChange} /></div>
        <div className="form-group"><label>核心卖点 (每点一行或用逗号分隔)</label><textarea name="features" value={formData.features} onChange={handleChange} rows={4}></textarea></div>
        <div className="form-group"><label>目标用户</label><input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} /></div>
        <div className="form-group"><label>价格</label><input type="text" name="price" value={formData.price} onChange={handleChange} /></div>
        <div className="form-group"><label>优惠活动</label><input type="text" name="promotion" value={formData.promotion} onChange={handleChange} /></div>
        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-primary">AI 帮我写</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};
export default ProductScriptGeneratorModal;