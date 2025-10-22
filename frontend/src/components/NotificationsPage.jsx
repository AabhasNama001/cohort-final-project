import React, { useEffect, useState } from "react";
// THE FIX: Import the new service file
import * as notificationService from "../services/notification.service";
import { FaBell } from "react-icons/fa";

function timeAgo(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationsPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        // THE FIX: Use the new service function
        const data = await notificationService.getNotifications();
        // THE FIX: 'data' is already the array, not the response
        setNotes(data || []);
      } catch (err) {
        setNotes([]);
      }
    })();
  }, []);

  return (
    <div className="bg-[#f1f1c7] min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <FaBell className="text-blue-600 text-2xl mr-2" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Notifications
          </h2>
        </div>

        {/* No notifications */}
        {notes.length === 0 ? (
          <div className="text-gray-500 text-center py-16 sm:py-20 rounded-lg bg-[#f5f5e0] shadow-md text-sm sm:text-base">
            No notifications
          </div>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li
                key={n._id}
                className="p-4 sm:p-5 border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Message & optional data */}
                <div className="flex-1 w-full">
                  <div className="text-gray-700 text-sm sm:text-base font-medium break-words">
                    {n.message}
                  </div>
                  {n.data && (
                    <div className="text-xs sm:text-sm text-gray-400 mt-1 break-words">
                      {JSON.stringify(n.data)}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="mt-2 sm:mt-0 sm:ml-4 text-xs sm:text-sm text-gray-400 flex-shrink-0">
                  {timeAgo(n.createdAt)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
