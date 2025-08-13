"use client"
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { removeNotification } from '@/store/notificationSlice';

export default function NotificationList() {
  const notifications = useSelector((state: RootState) => state.notification.notifications);
  const dispatch = useDispatch();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2 rounded-lg shadow-lg flex items-center justify-between border transition-colors duration-300
            ${
              n.type === 'success'
            ? 'bg-gradient-to-r from-green-400 to-green-600 border-green-500 text-white'
            : n.type === 'error'
            ? 'bg-gradient-to-r from-red-400 to-red-600 border-red-500 text-white'
            : n.type === 'info'
            ? 'bg-gradient-to-r from-blue-400 to-blue-600 border-blue-500 text-white'
            : 'bg-gradient-to-r from-yellow-300 to-yellow-500 border-yellow-400 text-gray-900'
            }
          `}
        >
          <span className="font-medium">{n.message}</span>
          <button
            className="ml-4 px-3 py-1 cursor-pointer rounded-full bg-white text-gray-500 bg-opacity-30 text-xs font-semibold hover:bg-opacity-60 transition-colors"
            onClick={() => dispatch(removeNotification(n.id))}
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  );
}
