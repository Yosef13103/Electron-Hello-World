const {BrowserWindow, app, Tray, Menu, dialog, nativeImage, screen, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

let win;
let tray = null;

const createWindow = () => {
  // Fixed dimensions for a quarter of a 1080p screen
  let windowWidth = 1920 / 2;
  let windowHeight = 1080 / 2;
  let taskbarHeight = 20; // Approximate taskbar height

  // Adjust position for bottom taskbar
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  let posX = screenWidth - windowWidth - 10;
  let posY = screenHeight - windowHeight - taskbarHeight;

  win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: posX,
    y: posY,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('html/index.html');
};


const createTray = () => {
  try {
    const iconPath = path.join(__dirname, '../image/logo.png')
    tray = new Tray(nativeImage.createFromPath(iconPath));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open', click: () => win.show() },
      { label: 'Quit', click: () => app.quit() },
      { type:'separator' },
      { label: 'Hi', click: () => dialog.showMessageBox({
          type: 'info',
          title: 'Greetings',
          message: 'Hello!',
        })
      },
    ]);
    tray.setToolTip('Hello World App');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  } catch (error) {
    const logFilePath = path.join(__dirname, 'error.log');
    const errorMessage = `Failed to create tray: ${error}\n`;
    fs.appendFile(logFilePath, errorMessage, (err) => {
      if (err) {
        console.error('Failed to write error to log file:', err);
      }
    });
  }
};

ipcMain.on('quit-app', () => {
  app.quit();
});

app.on('activate', () => {
  if (win == null)
    {
      createWindow();
    }
    else {
      win.show();
    }
  }
);

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  createWindow(width, height);
  createTray();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Prevent multiple instances of the app
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}