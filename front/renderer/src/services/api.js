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

/**
 * 【新】根据商品名称，请求后端生成备选提示词
 * @param {{productName: string}} data
 */
export const generatePrompts = (data) => {
  // 请与后端伙伴确认此接口地址
  return apiFetch('/api/product/generate-prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

/**
 * 【新】根据商品名称和用户选择的提示词，请求后端生成最终脚本
 * @param {{productName: string, prompts: string[]}} data
 */
export const generateProductScriptFromPrompt = (data) => {
  // 请与后端伙伴确认此接口地址
  return apiFetch('/api/product/generate-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
export const generateSpeech = (formData) => {
  // 请与后端伙伴确认此接口地址
  return apiFetch('/api/tts/generate-cloned', {
    method: 'POST',
    body: formData, // 直接发送 FormData，不要设置 Content-Type
  });
};
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