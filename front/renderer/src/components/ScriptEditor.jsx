// renderer/src/components/ScriptEditor.jsx

import React, { useState, useEffect, useRef } from 'react';
import { getScripts, saveScript } from '../services/api'; // 引入新的API服务

const SMART_VARIABLES = [
  { label: '下个整点间隔', value: '{nextHourInterval}' },
  { label: '当前在线人数', value: '{currentUserCount}' },
  { label: '用户昵称', value: '{userNickname}' },
];

// 定义一个空的脚本模板
const EMPTY_SCRIPT = { id: null, name: '', fragmentName: '', content: '' };

const ScriptEditor = ({ onGenerate, isLoading }) => {
  const [allScripts, setAllScripts] = useState([]); // 存储从后端获取的所有脚本
  const [currentScript, setCurrentScript] = useState(EMPTY_SCRIPT); // 当前正在编辑的脚本
  const contentRef = useRef(null);

  // Effect Hook: 组件加载时，从后端获取脚本列表
  useEffect(() => {
   console.log("后端 /api/scripts 接口尚未实现，当前使用前端模拟数据。");
   const MOCK_SCRIPTS = [
     { id: '1', name: '模拟脚本一' },
    { id: '2', name: '模拟脚本二' }
   ];
   setAllScripts(MOCK_SCRIPTS);
/*    const loadScripts = async () => {
      try {
        const scripts = await getScripts();
        setAllScripts(scripts);
      } catch (error) {
        alert('加载脚本列表失败，请检查后端服务是否开启。');
      }
    };
    loadScripts();
*/
  }, []);

  // 处理函数：当用户点击“新建脚本”
  const handleNewScript = () => {
    setCurrentScript(EMPTY_SCRIPT);
  };

  // 处理函数：当用户从下拉菜单选择一个脚本
  const handleSelectScript = (e) => {
    const scriptId = e.target.value;
    const selected = allScripts.find(s => s.id === scriptId) || EMPTY_SCRIPT;
    setCurrentScript(selected);
  };

  // 处理函数：当表单输入框内容变化时
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentScript(prev => ({ ...prev, [name]: value }));
  };

  // 处理函数：点击“保存修改”
  const handleSave = async () => {
    if (!currentScript.name || !currentScript.fragmentName) {
      alert('脚本名称和片段名称不能为空！');
      return;
    }
    try {
      const savedScript = await saveScript(currentScript);
      // 更新前端的脚本列表状态，以实现实时刷新
      setAllScripts(prev => {
        const index = prev.findIndex(s => s.id === savedScript.id);
        if (index > -1) {
          const newList = [...prev];
          newList[index] = savedScript;
          return newList;
        } else {
          return [...prev, savedScript];
        }
      });
      setCurrentScript(savedScript); // 更新当前脚本，以获取后端生成的ID
      alert('脚本保存成功！');
    } catch (error) {
      alert('保存失败，请查看控制台日志。');
    }
  };
  
  const handleInsertVariable = (variable) => { /* ... 此函数逻辑保持不变 ... */ };

  return (
    <div className="script-editor-form">
      <div className="toolbar" style={{ justifyContent: 'space-between', paddingBottom: '15px' }}>
        <h3>修改直播片段管理</h3>
        <button onClick={handleNewScript}>+ 新建脚本</button>
      </div>

      <div className="form-group">
        <label htmlFor="scriptSelect">* 选择已有脚本</label>
        <select id="scriptSelect" value={currentScript.id || ''} onChange={handleSelectScript}>
          <option value="" disabled>-- 请选择或新建一个脚本 --</option>
          {allScripts.map(script => (
            <option key={script.id} value={script.id}>{script.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="scriptName">* 脚本名称</label>
        <input type="text" name="name" value={currentScript.name} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label htmlFor="fragmentName">* 片段名称</label>
        <input type="text" name="fragmentName" value={currentScript.fragmentName} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>片段内容</label>
        <textarea name="content" value={currentScript.content} onChange={handleInputChange} ref={contentRef} rows={8} />
      </div>
      
      <div className="form-group">
        <label>插入智能变量</label>
        <select onChange={(e) => handleInsertVariable(e.target.value)} defaultValue="">
          <option value="" disabled>-- 点击选择变量 --</option>
          {SMART_VARIABLES.map(v => <option key={v.label} value={v.value}>{v.label}</option>)}
        </select>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={() => onGenerate(currentScript)} disabled={isLoading}>
          GPT 智能编写
        </button>
        <button className="btn-secondary" onClick={handleSave}>保存修改</button>
      </div>
    </div>
  );
};

export default ScriptEditor;