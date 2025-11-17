// electron.js

const { app, BrowserWindow, ipcMain, Menu } = require('electron'); // 1. 引入 Menu 模块
const path = require('path');
const keytar = require('keytar');

const SERVICE_NAME = 'AI-Live-App-V2';

// 2. 创建中文菜单模板
const menuTemplate = [
  {
    label: '文件',
    submenu: [
      {
        label: '退出',
        accelerator: 'CmdOrCtrl+Q', // 设置快捷键
        role: 'quit' // 使用内置的 'quit' 角色
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { label: '撤销', role: 'undo' },
      { label: '重做', role: 'redo' },
      { type: 'separator' }, // 分隔线
      { label: '剪切', role: 'cut' },
      { label: '复制', role: 'copy' },
      { label: '粘贴', role: 'paste' },
    ]
  },
  {
    label: '视图',
    submenu: [
      { label: '刷新', role: 'reload' },
      { label: '强制刷新', role: 'forceReload' },
      { type: 'separator' },
      { label: '切换开发者工具', role: 'toggleDevTools' }
    ]
  },
  {
    label: '功能',
    submenu: [
      {
        label: '模型训练',
        click: () => {
          // 当点击时，向渲染进程发送一个 'navigate' 消息
          const focusedWindow = BrowserWindow.getFocusedWindow();
          if (focusedWindow) {
            focusedWindow.webContents.send('navigate', 'model-training');
          }
        }
      }
    ]
  }
];


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL('http://localhost:5173');
  win.webContents.openDevTools(); // 调试完成后可以注释掉这行
}

app.whenReady().then(() => {
  // 3. 根据模板构建菜单
  const menu = Menu.buildFromTemplate(menuTemplate);
  // 4. 将构建好的菜单设置为应用程序菜单
  Menu.setApplicationMenu(menu);

  // Keychain 的 "接线员" 代码
  ipcMain.handle('keychain:setApiKey', async (event, apiKey) => {
    await keytar.setPassword(SERVICE_NAME, 'apiKey', apiKey);
  });
  
  ipcMain.handle('keychain:getApiKey', async () => {
    return await keytar.getPassword(SERVICE_NAME, 'apiKey');
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});