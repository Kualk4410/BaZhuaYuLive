// server/app.js

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import axios from 'axios';

// --- 数据库设置 ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json');
const adapter = new JSONFile(file);
// 定义默认数据结构
const defaultData = { scripts: [] };
// 在创建实例时直接传入默认数据
const db = new Low(adapter, defaultData);
// 读取数据库文件（如果不存在，db.data 会是我们上面定义的 defaultData）
await db.read();
// 确保在第一次写入时文件被创建
await db.write();
// ------------------

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- API 路由 ---

// 1. 【新】获取所有脚本列表的 API
app.get('/api/scripts', async (req, res) => {
  await db.read();
  res.status(200).json(db.data.scripts);
});

// 2. 【新】保存或更新脚本的 API
app.post('/api/scripts', async (req, res) => {
  const scriptData = req.body;
  await db.read();
  const { scripts } = db.data;
  
  const existingScriptIndex = scripts.findIndex(s => s.id === scriptData.id);

  if (existingScriptIndex > -1) {
    // 更新现有脚本
    scripts[existingScriptIndex] = scriptData;
    console.log(`脚本 [${scriptData.id}] 已更新。`);
  } else {
    // 创建新脚本
    scriptData.id = Date.now().toString(); // 用时间戳作为简单唯一ID
    scripts.push(scriptData);
    console.log(`新脚本 [${scriptData.name}] 已创建。`);
  }

  await db.write();
  res.status(200).json(scriptData); // 将保存后的脚本（含ID）返回给前端
});

// 3. 【保留】GPT智能编写的 API
app.post('/api/generate-script', async (req, res) => {
  // ... (此部分代码保持不变，还是用于调用 GPT)
   try {
    const apiKey = "sk-Your-Real-OpenAI-API-Key"; // 替换成您自己的真实 API Key
    const gptModel = "gpt-3.5-turbo";
    const userPrompt = req.body.content;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model: gptModel, messages: [{ role: "system", content: "你是一个专业的直播场控，你需要根据用户提供的直播稿，进行润色、扩写，使其更具吸引力。" }, { role: "user", content: userPrompt }] },
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
    );
    const generatedContent = response.data.choices[0].message.content;
    res.status(200).json({ success: true, content: generatedContent });
  } catch (error) {
    console.error("调用 GPT API 时出错:", error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, message: '调用 AI 服务失败' });
  }
});

app.listen(port, () => {
  console.log(`带数据库的真实后端已在 http://localhost:${port} 启动`);
});