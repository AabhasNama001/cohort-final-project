// Import the specific 'notificationApi' from your main api.js file
import { notificationApi } from "./api";

/**
 * Fetches all notifications for the user.
 * Assumes the backend route is GET /notifications
 */
export async function getNotifications() {
  const res = await notificationApi.get("/notifications");
  return res.data;
}

/**
 * Marks a specific notification as read.
 * Assumes the backend route is PATCH /notifications/:id/read
 */
export async function markNotificationAsRead(id) {
  const res = await notificationApi.patch(`/notifications/${id}/read`);
  return res.data;
}

/**
 * Marks all notifications as read.
 * Assumes the backend route is POST /notifications/read-all
 */
export async function markAllNotificationsAsRead() {
  const res = await notificationApi.post("/notifications/read-all");
  return res.data;
}
