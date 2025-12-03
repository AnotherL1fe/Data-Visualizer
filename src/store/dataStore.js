import { create } from 'zustand';

const useDataStore = create((set, get) => ({
  users: [],
  posts: {},
  isLoading: false,
  viewMode: 'list',
  
  setUsers: (users) => set({ users }),
  
  setPosts: (userId, posts) => 
    set((state) => ({
      posts: {
        ...state.posts,
        [userId]: posts
      }
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  hasUsers: () => get().users.length > 0,
  
  hasUserPosts: (userId) => !!get().posts[userId],
  
  getUserById: (id) => get().users.find(user => user.id === parseInt(id)),
  
  getPostsByUserId: (userId) => get().posts[userId] || [],
}));

export default useDataStore;