'use strict';
const fs = require('fs');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {

  win = new BrowserWindow({width: 800, height: 600, show: false, frame: false});

  // and load the index.html of the app.
  win.loadURL('file://' + __dirname + '/index.html');
  // win.show();
  
  win.webContents.on('did-finish-load', function() {
    
    function capture() {
      console.time('Capture');
      win.capturePage({x: 0, y: 0, width: 800, height: 600}, function(imageBuffer) {
        fs.writeFileSync('./tmp/image-' + Date.now() + '-a.png', imageBuffer.toPng());
        console.timeEnd('Capture');
        
        console.time('Capture');
        win.capturePage({x: 0, y: 0, width: 800, height: 600}, function(imageBuffer) {
          fs.writeFileSync('./tmp/image-' + Date.now() + '-b.png', imageBuffer.toPng());
          console.timeEnd('Capture');
        });
      });
    }
    
    setTimeout(capture, 1000);
  });

  // win.webContents.openDevTools();

  win.on('closed', function() {
    
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('Window closed');
    
    win = null;
  });
});
