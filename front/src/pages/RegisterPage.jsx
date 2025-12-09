import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      setIsLoading(false);
      return;
    }

    try {
      // В реальном приложении здесь был бы запрос к серверу
      // Для демо создаем фиктивного пользователя
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ1c2VyMiIsImVtYWlsIjoiZW1haWxAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.7q1M7gZgQYQKJh8bq7p7q7p7q7p7q7p7q7p7q7p7q7';
      
      login(
        { 
          id: 2, 
          username: formData.username, 
          email: formData.email 
        },
        fakeToken
      );
      
      navigate('/');
      
    } catch (err) {
      setError('Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>📝 Регистрация</h1>
            <p>Создайте новый аккаунт</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Имя пользователя</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder="Введите имя пользователя"
                required
                disabled={isLoading}
              />
            </div>

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
                placeholder="Введите пароль (минимум 6 символов)"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label>Подтвердите пароль</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Повторите пароль"
                required
                disabled={isLoading}
              />
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>

            <div className="auth-links">
              <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;