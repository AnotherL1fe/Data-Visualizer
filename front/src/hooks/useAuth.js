import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = 'http://localhost:5000/api';

export const useAuth = () => {
  const { 
    user, 
    token, 
    isAuthenticated, 
    login: storeLogin, 
    logout: storeLogout,
    setLoading 
  } = useAuthStore();
  
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Конфигурация axios для добавления токена
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Проверка токена при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/me`);
          if (response.data.success) {
            storeLogin(response.data.user, token);
          } else {
            storeLogout();
          }
        } catch (error) {
          storeLogout();
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [token, storeLogin, storeLogout, setLoading]);

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.success) {
        storeLogin(response.data.user, response.data.token);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          'Ошибка при входе. Проверьте данные и попробуйте снова';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success) {
        // Автоматически входим после регистрации
        storeLogin(response.data.user, response.data.token);
        return { success: true };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                          'Ошибка при регистрации. Попробуйте снова';
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    storeLogout();
    setAuthError('');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading: authLoading,
    error: authError,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: () => setAuthError('')
  };
};