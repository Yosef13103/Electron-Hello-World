const {BrowserWindow, app, Tray, Menu, dialog, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

let win;
let tray = null;

const createWindow = () => {
  
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('html/index.html');

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  });
}

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

app.whenReady().then(() => {
  createWindow();
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