// renderer/src/hooks/useBackendTTS.js
import { useState, useRef, useCallback } from 'react';
import { generateSpeech } from '../services/api'; // 我们稍后会创建这个API函数

export const useBackendTTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(new Audio()); // 使用 HTML Audio 元素来播放

  const speak = useCallback(async (text, modelId) => {
    if (!text || !modelId) return;
    setIsSpeaking(true);
    setError(null);

    try {
      // 1. 调用后端API，获取音频文件的URL或Base64数据
      const { audioUrl } = await generateSpeech({ text, modelId });

      // 2. 播放音频
      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.play();

      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => {
        setError('音频播放失败');
        setIsSpeaking(false);
      };

    } catch (err) {
      setError(err.message || '语音生成失败');
      setIsSpeaking(false);
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