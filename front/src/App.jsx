import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import UserDetailPage from './pages/UserDetailPage';
import CacheManager from './components/CacheManager/CacheManager';
import { useStorageMonitor } from './hooks/useLocalStorage';
import AddPostPage from './pages/addPostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import useAuthStore from './store/authStore';
import './App.css';

// Компонент для защиты маршрутов
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Компонент для публичных маршрутов
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Главный компонент с защищенными маршрутами
const AppContent = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [showCacheManager, setShowCacheManager] = useState(false);
    const storageInfo = useStorageMonitor();
    const { user, logout } = useAuthStore();

    return (
        <Layout>
            <div className="app-container">
                {/* Кнопка для показа/скрытия менеджера кеша */}
                <div className="cache-toggle">
                    <div
                        className={`cache-toggle-button ${isHovering ? 'visible' : ''}`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <button
                            className="cache-manager-toggle"
                            onClick={() => setShowCacheManager(!showCacheManager)}
                            title={`${storageInfo.usagePercent || 0}% использовано`}
                        >
                            {showCacheManager ? '❌' : '💾'}
                            {isHovering && (
                                <span className="cache-tooltip">
                                    {showCacheManager ? 'Скрыть кеш' : 'Показать кеш'}
                                    <br />
                                    <small>{storageInfo.usagePercent || 0}% использовано</small>
                                </span>
                            )}
                            {user && (
                                <div className="user-info-header">
                                    <button onClick={logout} className="logout-btn">
                                        →]
                                    </button>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {showCacheManager && <CacheManager />}

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/user/:id/*" element={<UserDetailPage />} /> {/* Добавлено /* */}
                    <Route path="/add-post" element={<AddPostPage />} />
                </Routes>
            </div>
        </Layout>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                } />

                <Route path="/register" element={
                    <PublicRoute>
                        <RegisterPage />
                    </PublicRoute>
                } />

                {/* Защищенные маршруты */}
                <Route path="/*" element={ // Изменено с "/" на "/*"
                    <ProtectedRoute>
                        <AppContent />
                    </ProtectedRoute>
                } />

                {/* Редирект для несуществующих маршрутов */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;