import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Состояние
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      
      // Действия
      login: (userData, token) => {
        // Сохраняем токен в localStorage
        localStorage.setItem('auth_token', token);
        
        set({ 
          user: userData, 
          token, 
          isAuthenticated: true,
          isLoading: false 
        });
      },
      
      logout: () => {
        // Удаляем токен из localStorage
        localStorage.removeItem('auth_token');
        
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Проверка аутентификации при загрузке
      checkAuth: () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Можно добавить проверку токена с сервером
          set({ token, isAuthenticated: true, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Проверяем аутентификацию при загрузке
useAuthStore.getState().checkAuth();

export default useAuthStore;