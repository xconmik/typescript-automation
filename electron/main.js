const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const { validateLicense } = require('./license');
let win;
let tray;

function promptLicense() {
  return dialog.showInputBox ? dialog.showInputBox({
    title: 'Enter License Key',
    label: 'License Key:',
    input: ''
  }) : Promise.resolve(null);
}

async function checkLicense() {
  // For demo: prompt for license if not present (replace with secure storage in production)
  let license = process.env.LICENSE_KEY;
  if (!license) {
    license = await promptLicense();
  }
  if (!validateLicense(license)) {
    dialog.showErrorBox('Invalid License', 'Please enter a valid license key.');
    app.quit();
    return false;
  }
  return true;
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(path.join(__dirname, '../out/index.html'));
}

function createTray() {
  tray = new Tray(path.join(__dirname, 'tray.png'));
  const menu = Menu.buildFromTemplate([
    { label: 'Open App', click: () => win.show() },
    { label: 'Run Automation', click: () => win.webContents.send('run-automation') },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('Lead Automation');
  tray.setContextMenu(menu);
}

app.whenReady().then(async () => {
  if (!(await checkLicense())) return;
  createWindow();
  createTray();
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on('run-automation', () => {
  // You can trigger your automation logic here
  // e.g., call a backend API or run a script
  // Example: win.webContents.send('automation-status', 'started');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});