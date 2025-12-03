import { useEffect } from 'react';
import jsonPlaceholderAPI from '../api/jsonPlaceholder';
import useDataStore from '../store/dataStore';

export const useUsersLoader = () => {
  const { users, setUsers, setLoading, hasUsers } = useDataStore();
  
  useEffect(() => {
    const loadUsers = async () => {
      if (hasUsers()) return;
      
      setLoading(true);
      try {
        const data = await jsonPlaceholderAPI.fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [setUsers, setLoading, hasUsers]);
  
  return { users };
};

export const useUserPostsLoader = (userId) => {
  const { setPosts, setLoading, hasUserPosts } = useDataStore();
  
  useEffect(() => {
    const loadPosts = async () => {
      if (hasUserPosts(userId)) return;
      
      setLoading(true);
      try {
        const data = await jsonPlaceholderAPI.fetchUserPosts(userId);
        setPosts(userId, data);
      } catch (error) {
        console.error(`Failed to load posts for user ${userId}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadPosts();
    }
  }, [userId, setPosts, setLoading, hasUserPosts]);
  
  return {};
};