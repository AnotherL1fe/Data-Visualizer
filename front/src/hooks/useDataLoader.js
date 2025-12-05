import { useEffect } from 'react';
import jsonPlaceholderAPI from '../api/jsonPlaceholder.js';
import useDataStore from '../store/dataStore.js';

export const useUsersLoader = (forceRefresh = false) => {
  const { users, setUsers, setLoading, hasUsers } = useDataStore();

  useEffect(() => {
    const loadUsers = async () => {
      // Если не форсируем обновление и пользователи уже загружены, пропускаем
      if (!forceRefresh && hasUsers()) {
        console.log('Using cached users from localStorage');
        return;
      }

      setLoading(true);
      try {
        console.log('Fetching users from API...');
        const data = await jsonPlaceholderAPI.fetchUsers();
        setUsers(data);

        // Логирование в консоль
        console.log(`Loaded ${data.length} users, saved to localStorage`);
      } catch (error) {
        console.error('Failed to load users:', error);

        // Если есть кешированные данные, используем их при ошибке сети
        if (users.length > 0) {
          console.log('Using cached data due to network error');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [forceRefresh, setUsers, setLoading, hasUsers, users.length]);

  return { users };
};

export const useUserPostsLoader = (userId, forceRefresh = false) => {
  const { setPosts, setLoading, hasUserPosts } = useDataStore();

  useEffect(() => {
    const loadPosts = async () => {
      if (!userId) return;

      // Если не форсируем обновление и посты уже загружены, пропускаем
      if (!forceRefresh && hasUserPosts(userId)) {
        console.log(`Using cached posts for user ${userId} from localStorage`);
        return;
      }

      setLoading(true);
      try {
        console.log(`Fetching posts for user ${userId} from API...`);
        const data = await jsonPlaceholderAPI.fetchUserPosts(userId);
        setPosts(userId, data);

        // Логирование в консоль
        console.log(`Loaded ${data.length} posts for user ${userId}, saved to localStorage`);
      } catch (error) {
        console.error(`Failed to load posts for user ${userId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadPosts();
    }
  }, [userId, forceRefresh, setPosts, setLoading, hasUserPosts]);

  return {};
};

// Хук для принудительного обновления данных
export const useForceRefresh = () => {
  const { clearCache } = useDataStore();

  const refreshAllData = () => {
    clearCache();
    window.location.reload();
  };

  return { refreshAllData };
};