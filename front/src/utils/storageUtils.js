export const exportData = () => {
  try {
    const store = JSON.parse(localStorage.getItem('data-visualizer-store'));
    const dataStr = JSON.stringify(store, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-visualizer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Data exported successfully');
    return true;
  } catch (error) {
    console.error('Error exporting data:', error);
    return false;
  }
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Валидация структуры данных
        if (!data || !data.state || !Array.isArray(data.state.users)) {
          throw new Error('Invalid data format');
        }
        
        // Сохраняем в localStorage
        localStorage.setItem('data-visualizer-store', JSON.stringify(data));
        
        console.log('Data imported successfully');
        resolve(true);
      } catch (error) {
        console.error('Error importing data:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const clearAllData = () => {
  try {
    // Удаляем только данные приложения
    localStorage.removeItem('data-visualizer-store');
    console.log('All app data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Проверка поддержки localStorage
export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('LocalStorage is not available:', e);
    return false;
  }
};

// Получить информацию о сохраненных данных
export const getStorageInfo = () => {
  try {
    const store = JSON.parse(localStorage.getItem('data-visualizer-store') || '{}');
    const usersCount = store.state?.users?.length || 0;
    const postsCount = Object.values(store.state?.posts || {}).reduce(
      (total, posts) => total + (posts?.length || 0), 0
    );
    const lastUpdated = store.state ? new Date().toLocaleString() : 'Never';
    
    return {
      usersCount,
      postsCount,
      lastUpdated,
      hasData: usersCount > 0 || postsCount > 0
    };
  } catch (error) {
    return {
      usersCount: 0,
      postsCount: 0,
      lastUpdated: 'Error',
      hasData: false
    };
  }
};