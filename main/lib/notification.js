const { Notification } = require('electron')

module.exports = ({ title, body, silent, onClickNotification }) => {
  const notification = new Notification({ title, body, silent })

  notification.on('click', () => {
    if (onClickNotification) onClickNotification()
  })

  notification.show()
}
