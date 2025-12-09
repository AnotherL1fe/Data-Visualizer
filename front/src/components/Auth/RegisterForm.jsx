import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const RegisterForm = ({ onRegister, isLoading, error, switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (formData.username.length < 3) {
      errors.username = 'Имя пользователя должно быть не менее 3 символов';
    }
    
    if (!formData.email.includes('@')) {
      errors.email = 'Введите корректный email';
    }
    
    if (formData.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onRegister(formData);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">📝 Регистрация</h2>
        
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Имя пользователя</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className={`form-input ${validationErrors.username ? 'error' : ''}`}
              placeholder="Введите имя пользователя"
              required
              disabled={isLoading}
            />
            {validationErrors.username && (
              <div className="validation-error">{validationErrors.username}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`form-input ${validationErrors.email ? 'error' : ''}`}
              placeholder="Введите ваш email"
              required
              disabled={isLoading}
            />
            {validationErrors.email && (
              <div className="validation-error">{validationErrors.email}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`form-input ${validationErrors.password ? 'error' : ''}`}
              placeholder="Введите пароль (минимум 6 символов)"
              required
              disabled={isLoading}
            />
            {validationErrors.password && (
              <div className="validation-error">{validationErrors.password}</div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Подтвердите пароль</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              placeholder="Повторите пароль"
              required
              disabled={isLoading}
            />
            {validationErrors.confirmPassword && (
              <div className="validation-error">{validationErrors.confirmPassword}</div>
            )}
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          
          <div className="auth-links">
            <button
              type="button"
              onClick={switchToLogin}
              className="auth-link-button"
              disabled={isLoading}
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;