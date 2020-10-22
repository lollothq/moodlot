const Store = require('electron-store')

const store = new Store()

module.exports = {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
}
