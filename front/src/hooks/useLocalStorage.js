import { useEffect, useState } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage key:', key, error);
    }
  }, [key, value]);

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error('Error removing localStorage key:', key, error);
    }
  };

  const clearAll = () => {
    try {
      window.localStorage.clear();
      setValue(initialValue);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return [value, setValue, removeItem, clearAll];
};

// Хук для мониторинга состояния localStorage
export const useStorageMonitor = () => {
  const [storageInfo, setStorageInfo] = useState({
    total: 0,
    used: 0,
    free: 0,
    usagePercent: 0
  });

  useEffect(() => {
    const calculateStorage = () => {
      try {
        let total = 0;
        let used = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          const value = localStorage.getItem(key);
          total += key.length + (value ? value.length : 0);
        }
        
        // Примерные расчеты (в реальном приложении можно использовать Storage API)
        const totalMB = 5 * 1024 * 1024; // 5MB для большинства браузеров
        const usedKB = total / 1024;
        const freeKB = (totalMB / 1024) - usedKB;
        const usagePercent = (usedKB / (totalMB / 1024)) * 100;
        
        setStorageInfo({
          total: (totalMB / 1024 / 1024).toFixed(2) + ' MB',
          used: usedKB.toFixed(2) + ' KB',
          free: freeKB.toFixed(2) + ' KB',
          usagePercent: usagePercent.toFixed(1)
        });
      } catch (error) {
        console.error('Error calculating storage:', error);
      }
    };

    calculateStorage();
    
    // Слушатель изменений в localStorage
    const handleStorageChange = (e) => {
      if (e.storageArea === localStorage) {
        calculateStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Периодическая проверка
    const interval = setInterval(calculateStorage, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return storageInfo;
};