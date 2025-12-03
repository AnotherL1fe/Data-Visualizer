import React from 'react';
import UserCard from './UserCard';
import './UserList.css';

const UserList = ({ users }) => {
  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-list-item">
          <UserCard user={user} />
        </div>
      ))}
    </div>
  );
};

export default UserList;