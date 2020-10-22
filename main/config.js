module.exports = {
  appName: 'MoodBound',
  appUrl: 'http://localhost:3000',
  path: {
    login: `http://localhost:3000/login`,
    home: `http://localhost:3000/home`,
    preloading: `http://localhost:3000/preloading`
  },
  events: {
    onlineStatusChange: 'online-status-changed',
    notificationMessage: 'new_message'
  }
}
