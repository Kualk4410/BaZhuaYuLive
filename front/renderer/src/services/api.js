// renderer/src/services/api.js

const API_BASE_URL = 'http://localhost:5000';

/**
 * API 请求的中央处理器
 * @param {string} url - 请求的 API 路径 (例如 /api/scripts)
 * @param {object} options - fetch API 的配置对象 (method, headers, body)
 * @returns {Promise<any>} - 成功时返回 data 部分，失败时抛出错误
 */
const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    
    // 检查网络层面的错误 (例如 404, 500)
    if (!response.ok) {
      throw new Error(`网络错误: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // 检查业务逻辑层面的错误 (由后端定义)
    if (result.code === 1) {
      return result.data; // 成功，只返回核心数据 data
    } else {
      // 失败，抛出后端提供的错误信息
      throw new Error(result.msg || '发生未知错误');
    }
  } catch (error) {
    console.error(`API 请求失败: ${url}`, error);
    // 将错误继续向上抛出，以便组件中的 catch 可以捕获
    throw error; 
  }
};

// --- 现在，我们用这个新的处理器来重写所有的 API 函数 ---

/**
 * 从后端获取所有脚本列表
 */
export const getScripts = () => {
  return apiFetch('/api/scripts'); // GET 请求，无需额外选项
};

/**
 * 保存一个新脚本或更新一个现有脚本
 * @param {object} scriptData - 脚本对象
 */
export const saveScript = (scriptData) => {
  return apiFetch('/api/scripts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scriptData),
  });
};

/**
 * 调用后端生成口播内容
 * @param {object} scriptData - 包含用户需求、变量等脚本数据
 */
export const generateScriptContent = (scriptData) => {
  // 注意！我们修改了请求的路径和 Body 的结构，以匹配 Python 后端
  return apiFetch('/api/v1/llm/single_chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // 后端需要 { "user_prompt": "..." } 格式
      body: JSON.stringify({ user_prompt: scriptData.content }), 
  });
};

// ... 未来所有新的 API 函数，都将以这种简洁的方式添加 ...

/**
 * 【示例】获取语音模型列表
 */
export const getTtsModels = () => {
    return apiFetch('/api/models/tts');
}




/**
 * 根据产品信息，请求后端生成口播稿
 * @param {object} productData - 包含产品信息的对象
 */
export const generateProductScript = (productData) => {
  // 1. 将结构化的产品数据，拼接成一个给 AI 的详细指令 (prompt)
  const user_prompt = `
    请根据以下产品信息，为我生成一段专业的直播口播稿：
    - 产品名称: ${productData.productName}
    - 核心卖点: ${productData.features.join('，')}
    - 目标用户: ${productData.targetAudience}
    - 价格: ${productData.price}
    - 优惠活动: ${productData.promotion}
    请直接返回生成的口播稿内容。
  `;

  // 2. 调用后端已有的 single_chat 接口
  return apiFetch('/api/v1/llm/single_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_prompt }), // 确保 Body 格式与后端匹配
  });
};
/**
 * 保存用户设置 (例如 API 地址, 模型选择等)
 * @param {object} settingsData - 包含设置的对象
 */
export const saveUserSettings = (settingsData) => {
  // 注意：这个 /api/settings 接口在当前的 Python 后端中可能尚未实现
  // 但我们需要这个函数让前端代码能够正常编译和运行。
  // 请与您的后端伙伴确认或添加此接口。
  return apiFetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settingsData),
  });
};
/**
 * 多步对话式生成朗读文本
 * @param {object} data - 包含 currentText, action, step 的对象
 */
export const refineScript = (data) => {
  // 注意：这个 /api/script/refine 接口在当前的 Python 后端中可能尚未实现
  // 但我们需要这个函数让前端代码能够正常编译和运行。
  // 请与您的后端伙伴确认或添加此接口。
  return apiFetch('/api/script/refine', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
/**
 * 请求后端生成语音
 * @param {object} data - 包含 text 和 modelId 的对象
 */
export const generateSpeech = (data) => {
  // 注意：这个 /api/speech/generate 接口在当前的 Python 后端中可能尚未实现
  // 但我们需要这个函数让前端代码能够正常编译和运行。
  // 请与您的后端伙伴确认或添加此接口。
  return apiFetch('/api/speech/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
/**
 * 获取可选的本地语言模型列表
 */
export const getLocalModels = () => {
  // 请与后端伙伴确认接口地址
  return apiFetch('/api/models/local');
};

/**
 * 开始一个模型训练任务
 * @param {string} modelId - 选中的模型ID
 * @param {File} file - 用户上传的训练样本文件
 */
export const startTraining = (modelId, file) => {
  const formData = new FormData();
  formData.append('modelId', modelId);
  formData.append('trainingSamples', file);
  
  // 请与后端伙伴确认接口地址
  // 注意：文件上传时不需要设置 Content-Type header，浏览器会自动处理
  return apiFetch('/api/training/start', {
    method: 'POST',
    body: formData,
  });
};

/**
 * 查询训练任务的状态
 * @param {string} jobId - 训练任务的ID
 */
export const getTrainingStatus = (jobId) => {
  // 请与后端伙伴确认接口地址
  return apiFetch(`/api/training/status/${jobId}`);
};