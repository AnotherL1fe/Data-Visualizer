import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const STORAGE_KEY = 'data-visualizer-store';

const useDataStore = create(
  persist(
    (set, get) => ({
      // Состояние
      users: [],
      posts: {},
      isLoading: false,
      viewMode: 'list',

      // Действия
      setUsers: (users) => set({ users }),

      addPost: (userId, post) => 
        set((state) => ({
          posts: {
            ...state.posts,
            [userId]: [...state.posts[userId], post]
          }
        })),

      setPosts: (userId, posts) =>
        set((state) => ({
          posts: {
            ...state.posts,
            [userId]: posts
          }
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setViewMode: (mode) => set({ viewMode: mode }),

      // Проверка наличия данных в кеше
      hasUsers: () => get().users.length > 0,

      hasUserPosts: (userId) => !!get().posts[userId],

      // Получение данных
      getUserById: (id) => get().users.find(user => user.id === parseInt(id)),

      getPostsByUserId: (userId) => get().posts[userId] || [],

      // Очистка кеша
      clearCache: () => set({
        users: [],
        posts: {},
        isLoading: false,
        viewMode: 'list'
      }),

      // Очистка только постов
      clearPostsCache: () => set({ posts: {} }),

      // Удалить конкретного пользователя из кеша
      removeUserFromCache: (userId) =>
        set((state) => {
          const newPosts = { ...state.posts };
          delete newPosts[userId];
          return { posts: newPosts };
        }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Исключаем isLoading из сохранения
      partialize: (state) => ({
        users: state.users,
        posts: state.posts,
        viewMode: state.viewMode
      }),
    }
  )
);

export default useDataStore;