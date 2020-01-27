const {
  app,
  BrowserWindow,
  Menu,
  dialog,
  ipcMain
} = require('electron')
const shell = require('electron').shell
const settings = require('electron-settings');

var fs = require('fs')

var strat;

var fileName;
var saveOptions;


var content;
const electronLocalshortcut = require('electron-localshortcut');



// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win


function createWindow() {
  // Create the browser window.
  var electron = require('electron');
  var screenElectron = electron.screen;
  var mainScreen = screenElectron.getPrimaryDisplay();
  let width = mainScreen['size']['width'];
  let height = mainScreen['size']['height'];
  console.log(width, height);
  var zoomFactor;
  if (height <= 768) {
    zoomFactor = 0.815;
  } else {
    zoomFactor = 1;
  }

  console.log(zoomFactor)

  win = new BrowserWindow({
    parent: true,
    show: false,
    frame: true,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      zoomFactor: zoomFactor,
    },

    maximizable: true,
    webviewTag: true,
    icon: __dirname + '/Icon/icon.ico'
  })


  // win.maximize()

  win.loadFile('src/home.html')

  win.once('ready-to-show', () => {

    win.show()
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  // create custom shortcut for dev tools
  electronLocalshortcut.register(win, 'Ctrl+]', () => {
    win.webContents.openDevTools()
  });





  var menu = Menu.buildFromTemplate([

    // { role: 'appMenu' }
    ...(process.platform === 'darwin' ? [{
      label: app.getName(),
      submenu: [{
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    }] : []),

    {
      label: 'File',
      submenu: [{
        role: 'quit'
      }]
    },
    {
      label: 'Settings',
      submenu: [
        // { role: 'reload' },
        {
          label: 'Twitter API',
          click() {
            type = 'api';
            createOptionsWindow();

          }
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        // { role: 'reload' },
        {
          role: 'forcereload'
        },
        // { role: 'toggledevtools' },
        {
          type: 'separator'
        },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    }

  ])

  Menu.setApplicationMenu(menu);
}


/* 
This method will be called when Electron has finished
initialization and is ready to create browser windows.
Some APIs can only be used after this event occurs.
*/
app.on('ready', createWindow)









// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {

    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})







//wait for close app event from home./html

ipcMain.on('close-me', (evt, arg) => {
  app.quit()
})


// settings windows generated from the variable "type"

let options


function createOptionsWindow() {
  // Create the browser window.
  options = new BrowserWindow({
    show: false,
    frame: true,
    width: 900,
    height: 650,
    maximizable: false,
    resizable: false,
    icon: __dirname + '/Icon/icon.ico'
  })
  options.setMenu(null)

  //allows any file in settings/ to be loaded using the same window parameters
  options.loadFile('src/settings/' + type + '.html')

  options.once('ready-to-show', () => {
    options.show()
  })
  // Open the DevTools. Used for debugging commented out in production
  options.webContents.openDevTools()








  // Emitted when the window is closed.
  options.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    options = null
  })
}



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.