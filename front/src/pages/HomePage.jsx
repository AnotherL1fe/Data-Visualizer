import React from 'react';
import { useUsersLoader } from '../hooks/useDataLoader';
import useDataStore from '../store/dataStore';
import UserList from '../components/Users/UserList';
import UserGrid from '../components/Users/UserGrid';
import Spinner from '../components/UI/Spinner';
import './HomePage.css';

const HomePage = () => {
  const { users } = useUsersLoader();
  const { isLoading, viewMode } = useDataStore();
  
  if (isLoading && users.length === 0) {
    return <Spinner />;
  }
  
  return (
    <div className="home-page">
      <div className="page-header">
        <h2>Users List</h2>
        <p className="users-count">Total users: {users.length}</p>
      </div>
      
      {viewMode === 'list' ? (
        <UserList users={users} />
      ) : (
        <UserGrid users={users} />
      )}
    </div>
  );
};

export default HomePage;