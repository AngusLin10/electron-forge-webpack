import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import express from 'express';
import cors from 'cors';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  setupExpressServer();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

const setupExpressServer = () => {
  const port = 3001;
  const expressApp = express();

  // 設置中間件
  const configureMiddleware = (app) => {
    app.use(cors());
    app.use(express.json());
  };

  // 設置路由
  const configureRoutes = (app) => {
    app.get('/', (req, res) => {
      res.json({ message: '連接成功' });
    });

    app.get('/api/date', (req, res) => {
      res.json({ date: new Date() });
    });
  };

  // 初始化服務器
  const startServer = (app, port) => {
    app.listen(port, () => {
      console.log(`Express server is running on port ${port}`);
    });
  };

  configureMiddleware(expressApp);
  configureRoutes(expressApp);
  startServer(expressApp, port);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
