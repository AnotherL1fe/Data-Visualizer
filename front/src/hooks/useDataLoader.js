import { useEffect } from 'react';
import jsonPlaceholderAPI from '../api/jsonPlaceholder.js';
import useDataStore from '../store/dataStore.js';

export const useUsersLoader = () => {
  const { users, setUsers, setLoading, hasUsers } = useDataStore();
  
  useEffect(() => {
    const loadUsers = async () => {
      // Если пользователи уже загружены, пропускаем запрос
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
      // Если посты уже загружены, пропускаем запрос
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

export const usePostActions = () => {
  const { addPostToUser, updateUserPost, removeUserPost } = useDataStore();
  
  const createPost = async (postData) => {
    try {
      const result = await jsonPlaceholderAPI.createPost(postData);
      if (result.success) {
        addPostToUser(postData.userId, result.post);
      }
      return result;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
  const updatePost = async (postId, postData) => {
    try {
      const result = await jsonPlaceholderAPI.updatePost(postId, postData);
      if (result.success) {
        updateUserPost(postData.userId, postId, result.post);
      }
      return result;
    } catch (error) {
      console.error(`Error updating post ${postId}:`, error);
      throw error;
    }
  };
  
  const deletePost = async (userId, postId) => {
    try {
      const result = await jsonPlaceholderAPI.deletePost(postId);
      if (result.success) {
        removeUserPost(userId, postId);
      }
      return result;
    } catch (error) {
      console.error(`Error deleting post ${postId}:`, error);
      throw error;
    }
  };
  
  return {
    createPost,
    updatePost,
    deletePost
  };
};