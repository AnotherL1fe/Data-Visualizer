import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // В реальном приложении здесь был бы запрос к серверу
      // Для демо используем фиктивные данные
      if (formData.email === 'user@example.com' && formData.password === 'password123') {
        // Фиктивный токен
        const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        
        login(
          { id: 1, username: 'user', email: formData.email },
          fakeToken
        );
        
        navigate('/');
      } else {
        setError('Неверный email или пароль');
      }
    } catch (err) {
      setError('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>🔐 Вход в систему</h1>
            <p>Войдите, чтобы получить доступ к данным</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Введите ваш email"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Пароль</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Введите ваш пароль"
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Вход...' : 'Войти'}
            </button>

            <div className="auth-links">
              <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
              </p>
            </div>
          </form>

          <div className="auth-footer">
            <p><strong>Демо данные:</strong></p>
            <p>Email: <code>user@example.com</code></p>
            <p>Пароль: <code>password123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;