// front/renderer/src/services/api.js (最终版本)

const API_BASE_URL = 'http://localhost:5000'; // 端口已修正为 5000

const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    if (!response.ok) throw new Error(`网络错误: ${response.status}`);
    const result = await response.json();
    if (result.code === 1) return result.data;
    else throw new Error(result.msg || '发生未知错误');
  } catch (error) {
    console.error(`API 请求失败: ${url}`, error);
    throw error;
  }
};

// --- AI & 脚本核心功能 ---
export const generateScriptContent = (scriptData) => {
  return apiFetch('/api/v1/llm/single_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_prompt: scriptData.content }),
  });
};

export const generateProductScript = (productData) => {
  const user_prompt = `请根据以下产品信息，为我生成一段专业的直播口播稿：\n- 产品名称: ${productData.productName}\n- 核心卖点: ${productData.features.join('，')}\n- 目标用户: ${productData.targetAudience}\n- 价格: ${productData.price}\n- 优惠活动: ${productData.promotion}\n请直接返回生成的口播稿内容。`;
  return apiFetch('/api/v1/llm/single_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_prompt }),
  });
};

export const refineScript = (data) => apiFetch('/api/script/refine', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

// --- 脚本管理 ---
export const getScripts = () => apiFetch('/api/scripts');
export const saveScript = (scriptData) => apiFetch('/api/scripts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(scriptData),
});

// --- TTS & 模型管理 ---
export const getTtsModels = () => apiFetch('/api/models/tts');
export const generateSpeech = (data) => apiFetch('/api/speech/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
export const getLocalModels = () => apiFetch('/api/models/local');
export const startTraining = (modelId, file) => {
  const formData = new FormData();
  formData.append('modelId', modelId);
  formData.append('trainingSamples', file);
  return apiFetch('/api/training/start', { method: 'POST', body: formData });
};
export const getTrainingStatus = (jobId) => apiFetch(`/api/training/status/${jobId}`);

// --- 其他 ---
export const saveUserSettings = (settingsData) => apiFetch('/api/settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(settingsData),
});