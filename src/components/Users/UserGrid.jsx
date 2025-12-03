import React from 'react';
import UserCard from './UserCard';
import './UserGrid.css';

const UserGrid = ({ users }) => {
  return (
    <div className="user-grid">
      {users.map((user) => (
        <div key={user.id} className="user-grid-item">
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};

export default UserGrid;