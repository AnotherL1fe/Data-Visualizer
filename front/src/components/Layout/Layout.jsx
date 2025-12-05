import React from 'react';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>Data Visualizer © 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;