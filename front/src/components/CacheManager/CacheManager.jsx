import React, { useState } from 'react';
import useDataStore from '../../store/dataStore';
import './CacheManager.css';

const CacheManager = () => {
  const [showDetails, setShowDetails] = useState(false);
  const {
    users,
    posts,
    clearCache,
    clearPostsCache,
    removeUserFromCache
  } = useDataStore();

  const getCacheSize = () => {
    const data = {
      users,
      posts,
      viewMode: useDataStore.getState().viewMode
    };
    const jsonString = JSON.stringify(data);
    return (jsonString.length / 1024).toFixed(2) + ' KB';
  };

  const getPostCount = () => {
    return Object.values(posts).reduce((total, userPosts) => 
      total + (userPosts?.length || 0), 0
    );
  };

  return (
    <div className="cache-manager">
      <div className="cache-header">
        <h4> Управление кешем</h4>
        <button 
          className="toggle-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Скрыть' : 'Показать'} детали
        </button>
      </div>

      <div className="cache-stats">
        <div className="stat-item">
          <span className="stat-label">Пользователи:</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Посты:</span>
          <span className="stat-value">{getPostCount()}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Размер кеша:</span>
          <span className="stat-value">{getCacheSize()}</span>
        </div>
      </div>

      {showDetails && (
        <div className="cache-details">
          <div className="cached-users">
            <h5>Закешированные пользователи:</h5>
            {users.map(user => (
              <div key={user.id} className="cached-item">
                <span> {user.name}</span>
                <button
                  className="remove-btn"
                  onClick={() => removeUserFromCache(user.id)}
                  title="Удалить посты этого пользователя из кеша"
                >
                  
                </button>
              </div>
            ))}
          </div>

          <div className="cached-posts">
            <h5>Закешированные посты по пользователям:</h5>
            {Object.keys(posts).map(userId => {
              const userPosts = posts[userId];
              const user = users.find(u => u.id === parseInt(userId));
              return (
                <div key={userId} className="cached-item">
                  <span>
                     {user?.name || `User ${userId}`}: {userPosts.length} постов
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="cache-actions">
        <button
          className="action-btn clear-posts-btn"
          onClick={clearPostsCache}
        >
          Очистить кеш постов
        </button>
        <button
          className="action-btn clear-all-btn"
          onClick={clearCache}
        >
          Очистить весь кеш
        </button>
        <button
          className="action-btn refresh-btn"
          onClick={() => window.location.reload()}
        >
          Обновить страницу
        </button>
      </div>

      <div className="cache-info">
        <small>
          Данные автоматически сохраняются в localStorage.
          При повторном посещении данные загружаются из кеша.
        </small>
      </div>
    </div>
  );
};

export default CacheManager;