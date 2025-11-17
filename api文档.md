下面是一份**完整、专业、详尽**的后端 API 接口文档，它**完全基于**您当前的前端界面和功能需求生成。

---

### **AI 直播系统 - 后端 API 接口文档 (V1.0)**

#### **一、 项目概述**

本文档旨在定义 AI 直播系统前端与后端之间的通信接口。所有接口都应遵循本文档规定的格式和路径，以确保前后端能够顺利对接。

*   **项目基地址 (Base URL)**: `http://localhost:5000`
*   **数据交换格式**: 所有请求和响应的 Body 均为 `application/json` 格式，除非特别注明（如文件上传）。

#### **二、 通用响应格式**

为了统一处理，所有 API 的响应都必须遵循以下结构：

```json
{
  "code": 1,         // 响应码：1 表示成功，0 表示失败
  "msg": "操作成功",  // 响应消息：成功或失败的文字描述
  "data": { ... }    // 响应数据：成功时返回核心数据，失败时为 null
}
```

---

### **三、 API 接口详情**

#### **模块一：脚本管理 (Script Management)**

##### **1. 获取所有脚本列表**

*   **功能描述**: 用于填充前端左侧“选择已有脚本”的下拉菜单。
*   **Endpoint**: `GET /api/scripts`
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "获取脚本列表成功",
      "data": [
        {
          "id": "1678886400001",
          "name": "618大促通用脚本",
          "fragmentName": "开场白",
          "content": "家人们，欢迎来到618直播间！"
        },
        {
          "id": "1678886400002",
          "name": "新品耳机发布脚本",
          "fragmentName": "产品介绍",
          "content": "今天我们带来了一款革命性的新产品..."
        }
      ]
    }
    ```

##### **2. 保存或更新脚本**

*   **功能描述**: 用于“新建脚本”或“保存修改”。当请求体中包含 `id` 时为更新，不包含 `id` 时为新建。
*   **Endpoint**: `POST /api/scripts`
*   **请求 Body**:
    ```json
    {
      "id": "1678886400001", // 可选，用于更新
      "name": "618大促通用脚本",
      "fragmentName": "暖场互动",
      "content": "家人们，大家晚上好！"
    }
    ```
*   **成功响应 (`code: 1`)**: 后端返回保存后的完整脚本对象（如果是新建，会包含新生成的 `id`）。
    ```json
    {
      "code": 1,
      "msg": "脚本保存成功",
      "data": {
        "id": "1678886400001",
        "name": "618大促通用脚本",
        "fragmentName": "暖场互动",
        "content": "家人们，大家晚上好！"
      }
    }
    ```

#### **模块二：AI 内容生成 (AI Content Generation)**

##### **1.【核心】根据产品信息生成口播稿 (AI 生成商品稿)**

*   **功能描述**: 接收结构化的产品信息，生成专业的口播稿。
*   **Endpoint**: `POST /api/product/generate-script`
*   **请求 Body**:
    ```json
    {
      "productName": "新款智能降噪耳机",
      "features": ["主动降噪", "持久续航", "运动可用", "防水防汗"],
      "targetAudience": "通勤上班族",
      "price": "288",
      "promotion": "前一百下单立减四十元"
    }
    ```
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "口播稿生成成功",
      "data": {
        "scriptContent": "家人们！今天给大家带来的这款新款智能降噪耳机，简直是通勤路上的福音！它不仅有主动降噪..."
      }
    }
    ```

##### **2. 文本润色 (GPT 智能编写)**

*   **功能描述**: 接收用户输入的任意文本，进行 AI 优化和润色。
*   **Endpoint**: `POST /api/script/polish`
*   **请求 Body**:
    ```json
    {
      "content": "欢迎大家，今天卖耳机。"
    }
    ```
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "润色成功",
      "data": {
        "content": "欢迎每一位朋友来到我们的直播间！今天，我们将为大家隆重介绍一款颠覆您听觉体验的耳机..."
      }
    }
    ```

##### **3. 多步对话式生成脚本 (AI 脚本向导)**

*   **功能描述**: 通过多步对话，引导用户生成最终脚本。
*   **Endpoint**: `POST /api/script/refine`
*   **请求 Body**:
    ```json
    {
      "currentText": "欢迎进入直播间。", // 当前文本，第一步时为用户提示词
      "action": "generate_draft",     // 用户选择的操作指令
      "step": 1                       // 当前步骤
    }
    ```
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "处理成功",
      "data": {
        "refinedText": "热烈欢迎每一位朋友进入我们的直播间！",
        "nextStep": 2,
        "availableActions": ["correct_grammar", "set_length_50"]
      }
    }
    ```

#### **模块三：高级语音合成 (Advanced TTS)**

##### **1. 获取可选的语音模型列表**

*   **功能描述**: 用于填充“高级语音合成”部分的模型下拉菜单。
*   **Endpoint**: `GET /api/models/tts`
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "获取成功",
      "data": {
        "models": [
          { "id": "f5tts", "name": "F5TTS (快速)" },
          { "id": "cosyvoice", "name": "CosyVoice (情感丰富)" }
        ]
      }
    }
    ```

##### **2. 使用目标音色进行语音合成 (开始推理)**

*   **功能描述**: 结合文本、所选模型和音色样本，进行语音克隆并生成音频。
*   **Endpoint**: `POST /api/tts/generate-cloned`
*   **请求格式**: `multipart/form-data`
*   **请求字段**:
    *   `text` (字符串): "欢迎来到我的直播间..."
    *   `modelId` (字符串): "f5tts"
    *   `voiceSample` (文件): 用户上传的 5-10s 音频文件 (.wav, .mp3)
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "语音生成成功",
      "data": {
        "audioUrl": "http://your-server.com/audio/generated_12345.mp3" // 返回可供前端播放的音频文件URL
      }
    }
    ```

#### **模块四：模型训练 (Model Training)**

##### **1. 获取可选的本地语言模型列表**

*   **功能描述**: 用于填充“模型训练”页面的基础模型下拉菜单。
*   **Endpoint**: `GET /api/models/local`
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "获取成功",
      "data": {
        "models": [
          { "id": "chatglm2_6b", "name": "ChatGLM2-6B" },
          { "id": "llama2_7b_chat", "name": "Llama2-7B-Chat" }
        ]
      }
    }
    ```

##### **2. 启动一键训练任务**

*   **功能描述**: 启动一个异步的训练任务。
*   **Endpoint**: `POST /api/training/start`
*   **请求格式**: `multipart/form-data`
*   **请求字段**:
    *   `modelId` (字符串): "chatglm2_6b"
    *   `trainingSamples` (文件): 用户上传的训练样本压缩包 (.zip)
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "训练任务已成功启动",
      "data": {
        "jobId": "train_task_abcde12345", // 返回唯一的任务ID，用于后续查询
        "status": "queued",
        "message": "任务已进入等待队列"
      }
    }
    ```

##### **3. 查询训练任务状态**

*   **功能描述**: 前端通过此接口轮询，获取训练的实时进度。
*   **Endpoint**: `GET /api/training/status/:jobId`
    *   *示例*: `GET /api/training/status/train_task_abcde12345`
*   **成功响应 (`code: 1`)**:
    ```json
    {
      "code": 1,
      "msg": "状态获取成功",
      "data": {
        "jobId": "train_task_abcde12345",
        "status": "running", // "queued", "running", "completed", "failed"
        "progress": 0.42,     // 训练进度 (0.0 到 1.0)
        "message": "正在处理第 4200/10000 批数据..."
      }
    }
    ```

---

这份文档涵盖了您当前前端所有功能所需的后端支持。现在，您可以满怀信心地将它交给 Kualk4410，你们的协作将会变得前所未有的顺畅！