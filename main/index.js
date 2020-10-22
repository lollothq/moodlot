const { app, BrowserWindow, ipcMain, session } = require('electron')
const { resolve: resolveRootPath } = require('app-root-path')
const isDev = require('electron-is-dev')
const path = require('path')

const { initMenu } = require('./lib/menu')
const store = require('./lib/store')
const config = require('./config')

// checking for development
console.log(`on ${isDev ? 'development' : 'production'} mode.`)
console.log(`app name: ${config.appName}`)
console.log(`app url: ${config.appUrl}`)
console.log('version: ', app.getVersion())

let mainWindow
let onlineStatusWindow

// create internet checking window
function createOnlineWindow() {
  onlineStatusWindow = new BrowserWindow({
    width: 0,
    height: 0,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const onlineStatusPageFilePath = resolveRootPath('./main/static/pages/online-status.html')
  onlineStatusWindow.loadURL(`file://${onlineStatusPageFilePath}`)
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 880,
    height: 664,
    show: false,
    // resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const token = store.get('token')
  console.log('checking token', token)
  if (token) {
    session.defaultSession.cookies.set({ url: config.appUrl, name: 'token', value: token }).then(
      () => {
        console.log('token')
      },
      (err) => {
        console.error(err)
      }
    )
  }

  initMenu(() => {
    mainWindow.webContents.send('LOGOUT')
  })
}

app.whenReady().then(() => {
  createWindow()
  createOnlineWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// trigger event: update internet connection
ipcMain.on(config.events.onlineStatusChange, (event, status) => {
  console.log(`connection: ${status}`)
  process.env.CONNECTION = status

  if (status === 'online') {
    mainWindow.loadURL(config.path.preloading)
    mainWindow.show()
    mainWindow.webContents.openDevTools({ mode: 'undocked' })
  }
})

app.once('before-quit', async () => {
  const cookies = await session.defaultSession.cookies.get({})

  cookies.forEach((cookieItem) => {
    const isToken = cookieItem.name === 'token'
    if (isToken) {
      store.set('token', cookieItem.value)
    }
  })

  console.log(cookies)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
