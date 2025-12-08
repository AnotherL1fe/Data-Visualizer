import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import UserDetailPage from './pages/UserDetailPage';
import CacheManager from './components/CacheManager/CacheManager';
import { useStorageMonitor } from './hooks/useLocalStorage';
import AddPostPage from './pages/addPostPage';
import './App.css';

function App() {
    const [showCacheManager, setShowCacheManager] = useState(false);
    const storageInfo = useStorageMonitor();

    return (
        <Router>
            <Layout>
                <div className="app-container">
                    {/* Кнопка для показа/скрытия менеджера кеша */}
                    <div className="cache-toggle">
                        <button
                            className="cache-manager-toggle"
                            onClick={() => setShowCacheManager(!showCacheManager)}
                        >
                            {showCacheManager ? '❌ Скрыть кеш' : '💾 Показать кеш'}
                            <span className="storage-indicator">
                                {storageInfo.usagePercent}% использовано
                            </span>
                        </button>
                    </div>

                    {showCacheManager && <CacheManager />}


                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/user/:id" element={<UserDetailPage />} />
                            <Route path="/user/:id/add-post" element={<AddPostPage />} />
                            <Route path="/add-post" element={<AddPostPage />} />
                        </Routes>
                    </div>
            </Layout>
        </Router>
    );
}

export default App;