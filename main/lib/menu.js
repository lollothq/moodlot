const { app, Menu, shell } = require('electron')

const isMac = process.platform === 'darwin'

const tabMenuForApp = {
  label: app.name,
  submenu: [
    { role: 'about' },
    { type: 'separator' },
    { role: 'services' },
    { type: 'separator' },
    { role: 'hide' },
    { role: 'hideothers' },
    { role: 'unhide' },
    { type: 'separator' },
    { role: 'quit' }
  ]
}

const macMenuB = [
  { role: 'pasteAndMatchStyle' },
  { role: 'delete' },
  { role: 'selectAll' },
  { type: 'separator' },
  {
    label: 'Speech',
    submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
  }
]

const macMenuC = [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]

const template = (logout) => {
  const electronMenuTemplate = [
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? macMenuB : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }, ...(isMac ? macMenuC : [{ role: 'close' }])]
    },
    {
      label: 'Account',
      submenu: [
        {
          label: 'Log out',
          click: async () => {
            logout()
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = isMac ? [tabMenuForApp] : []

  const result = [...menu, ...electronMenuTemplate]
  return result
}

module.exports = {
  initMenu: (logout) => {
    const menu = Menu.buildFromTemplate(template(logout))
    Menu.setApplicationMenu(menu)
  }
}
