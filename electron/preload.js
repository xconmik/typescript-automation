const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  runAutomation: () => ipcRenderer.send('run-automation'),
  onRunAutomation: (cb) => ipcRenderer.on('run-automation', cb)
});
