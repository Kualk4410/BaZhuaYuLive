// renderer/src/components/ProductScriptGeneratorModal.jsx
import React, { useState } from 'react';
import { generateProductScript } from '../services/api'; // 我们稍后会创建这个函数

const ProductScriptGeneratorModal = ({ onClose, onScriptGenerated, setIsLoading }) => {
  // 使用一个 state 对象来管理所有表单字段
  const [formData, setFormData] = useState({
    productName: '',
    features: '', // 为了简单，我们用 textarea 让用户输入，用逗号或换行分隔
    targetAudience: '',
    price: '',
    promotion: '',
  });

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
      // 将 features 字符串分割成数组，以符合后端可能的需要
      const featuresArray = formData.features.split(/[\n,，]/).filter(f => f.trim() !== '');
      
      const response = await generateProductScript({ ...formData, features: featuresArray });
      
      // 调用父组件传来的回调函数，将生成的脚本内容传回主界面
      onScriptGenerated(response);
      onClose(); // 关闭弹窗
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
        
        <div className="form-group">
          <label>产品名称*</label>
          <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="例如：新款智能降噪耳机" />
        </div>
        <div className="form-group">
          <label>核心卖点 (每点一行或用逗号分隔)</label>
          <textarea name="features" value={formData.features} onChange={handleChange} rows={4} placeholder="例如：主动降噪&#10;24小时续航&#10;IPX7防水"></textarea>
        </div>
        <div className="form-group">
          <label>目标用户</label>
          <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="例如：音乐发烧友，通勤上班族" />
        </div>
        <div className="form-group">
          <label>价格</label>
          <input type="text" name="price" value={formData.price} onChange={handleChange} placeholder="例如：599元" />
        </div>
        <div className="form-group">
          <label>优惠活动</label>
          <input type="text" name="promotion" value={formData.promotion} onChange={handleChange} placeholder="例如：首发优惠，立减100元" />
        </div>

        <div className="modal-actions">
          <button onClick={handleSubmit} className="btn-primary">AI 帮我写</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

export default ProductScriptGeneratorModal;