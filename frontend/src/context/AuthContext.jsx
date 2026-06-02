import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Validate token and fetch user on load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data);
            await fetchNotifications();
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Failed to validate token on load:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Periodically fetch notifications (every 30 seconds if user logged in)
  useEffect(() => {
    let interval;
    if (user) {
      fetchNotifications();
      interval = setInterval(() => {
        fetchNotifications();
      }, 30000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter((n) => !n.read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  // Register User
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: userToken, ...userData } = res.data;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        return { success: true, role: userData.role };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials. Try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  // Mark notification as read
  const markNotificationRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notifications,
        unreadCount,
        register,
        login,
        logout: handleLogout,
        fetchNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
