const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  keychain: {
    setApiKey: (apiKey) => ipcRenderer.invoke('keychain:setApiKey', apiKey),
    getApiKey: () => ipcRenderer.invoke('keychain:getApiKey'),
  },
  receive: (channel, func) => {
    // 只允许指定的 'navigate' 通道
    const validChannels = ['navigate'];
    if (validChannels.includes(channel)) {
      // 安全地将主进程的消息转发给渲染进程的回调函数
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});