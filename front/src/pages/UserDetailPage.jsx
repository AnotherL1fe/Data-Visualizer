import React from 'react';
import { useParams, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useUserPostsLoader } from '../hooks/useDataLoader.js';
import useDataStore from '../store/dataStore.js';
import UserPosts from '../components/Posts/UserPosts.jsx';
import Spinner from '../components/UI/Spinner.jsx';
import './UserDetailPage.css';

const UserDetailPage = () => {
  const { id } = useParams();
  useUserPostsLoader(id);
  
  const user = useDataStore((state) => state.getUserById(id));
  const isLoading = useDataStore((state) => state.isLoading);
  
  if (isLoading && !user) {
    return <Spinner />;
  }
  
  if (!user) {
    return (
      <div className="user-not-found">
        <h2>User not found</h2>
        <Link to="/" className="back-link">← Back to users</Link>
      </div>
    );
  }
  
  return (
    <div className="user-detail-page">
      <Link to="/" className="back-link">← Back to users</Link>
      
      <div className="user-profile">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user.name.charAt(0)}</span>
          </div>
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-username">@{user.username}</p>
          </div>
        </div>
        
        <div className="profile-details">
          <div className="detail-card">
            <h4>Contact Information</h4>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Website:</strong> 
              <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                {user.website}
              </a>
            </p>
          </div>
          
          <div className="detail-card">
            <h4>Address</h4>
            <p>{user.address?.street}, {user.address?.suite}</p>
            <p>{user.address?.city}, {user.address?.zipcode}</p>
          </div>
          
          <div className="detail-card">
            <h4>Company</h4>
            <p><strong>{user.company?.name}</strong></p>
            <p>{user.company?.catchPhrase}</p>
            <p><em>{user.company?.bs}</em></p>
          </div>
        </div>
        
        {/* Добавьте вложенные маршруты для UserDetailPage */}
        <Routes>
          <Route path="/" element={<UserPosts userId={id} />} />
          <Route path="/add-post" element={<addPostPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDetailPage;