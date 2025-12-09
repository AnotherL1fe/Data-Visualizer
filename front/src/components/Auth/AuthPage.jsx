import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';

const AuthPage = ({ onLogin, onRegister, isLoading, error }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h1>📊 Data Visualizer</h1>
        <p>Войдите в систему для доступа к данным</p>
      </div>
      
      {isLogin ? (
        <LoginForm
          onLogin={onLogin}
          isLoading={isLoading}
          error={error}
          switchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onRegister={onRegister}
          isLoading={isLoading}
          error={error}
          switchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};

export default AuthPage;