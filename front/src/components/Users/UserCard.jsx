import React from 'react';
import { Link } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <div className="user-avatar">
        <span>{user.name.charAt(0)}</span>
      </div>
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">📧 {user.email}</p>
        <p className="user-company">🏢 {user.company.name}</p>
        <p className="user-website">🌐 {user.website}</p>
      </div>
      <div className="user-actions">
        <Link to={`/user/${user.id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default UserCard;