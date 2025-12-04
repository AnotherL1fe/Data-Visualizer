//Библиотека для http-запросов
import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

const jsonPlaceholderAPI = {
  async fetchUsers() {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async fetchUserPosts(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw error;
    }
  },

  async fetchUserById(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  }
};

export default jsonPlaceholderAPI;