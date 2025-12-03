import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import UserDetailPage from './pages/UserDetailPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/user/:id" element={<UserDetailPage />} />
                    </Routes>
                </Layout>
            </Router>
        </ErrorBoundary>
    );
}

export default App;