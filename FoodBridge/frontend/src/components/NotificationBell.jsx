import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';
import '../styles/Navbar.css';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNotificationClick = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleDeleteNotification = (e, notificationId) => {
    e.stopPropagation();
    deleteNotification(notificationId);
  };

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h6>Notifications</h6>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={() => {
                  markAllAsRead();
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}
                  onClick={() => handleNotificationClick(notif._id)}
                >
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <small className="notification-time">
                      {new Date(notif.createdAt).toLocaleTimeString()}
                    </small>
                  </div>
                  <button
                    className="delete-notif-btn"
                    onClick={(e) => handleDeleteNotification(e, notif._id)}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="notification-overlay"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
