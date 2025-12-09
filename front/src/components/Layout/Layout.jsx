import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
  return (
    <div className="app-layout">
      <Header user={user} onLogout={onLogout} />
      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>Data Visualizer © 2024</p>
          {user && <p>Вы вошли как: {user.username}</p>}
        </div>
      </footer>
    </div>
  );
};

export default Layout;