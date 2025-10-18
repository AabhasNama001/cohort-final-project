const notifications = []

function addNotification(item) {
  const _id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
  const n = Object.assign({ _id, createdAt: new Date().toISOString() }, item)
  notifications.unshift(n)
  // keep only recent 200
  if (notifications.length > 200) notifications.length = 200
  return n
}

function getNotifications() {
  return notifications
}

module.exports = { addNotification, getNotifications }
