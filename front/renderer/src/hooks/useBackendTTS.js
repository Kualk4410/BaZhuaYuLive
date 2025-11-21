// renderer/src/hooks/useBackendTTS.js
import { useState, useRef, useCallback } from 'react';
import { generateSpeech } from '../services/api'; // 我们稍后会创建这个API函数

export const useBackendTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(new Audio()); // 使用 HTML Audio 元素来播放

  const speak = useCallback(async (text, modelId, voiceFile) => {
    if (!text || !modelId || !voiceFile) return;
    setIsSpeaking(true);
    setError(null);

    try {
      // 使用 FormData 来打包文本、模型ID和音频文件
      const formData = new FormData();
      formData.append('text', text);
      formData.append('modelId', modelId);
      formData.append('voiceSample', voiceFile);
    
      // 调用后端API，注意 generateSpeech 函数也需要修改以支持 FormData
      const { audioUrl } = await generateSpeech(formData);

      // ... 后续播放逻辑保持不变 ...
    } catch (err) {
      // ... 错误处理保持不变 ...
    }
  }, []);
  const stop = useCallback(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, error, speak, stop };
};