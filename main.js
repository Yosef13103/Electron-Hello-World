const {BrowserWindow, app, Tray, Menu, dialog} = require('electron');
let win;
let tray = null;

const createWindow = () => {
  createTray();
  
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

/* TODO: Fix tray not showing up when the application is compiled */
const createTray = () => {
  try {
    tray = new Tray('image/logo.png');
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Open', click: () => {
        win.show();
      }},
      {label: 'Quit', click: () => {
        app.quit();
      }},
      {label: 'Hi', click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Greetings',
          message: 'Hello!',
        });
      }},
    ]);
    tray.setToolTip('Hello World App'); // Hover text for the tray icon
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
      win.isVisible() ? win.hide() : win.show();
    });
  } catch (error) {
    alert('Failed to create tray ' + error);
  }
}

app.whenReady().then(() => {
  createWindow();
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