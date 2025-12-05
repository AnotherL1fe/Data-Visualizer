import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

// Создаем папку data если ее нет
fs.mkdir(DATA_DIR, { recursive: true }).catch(console.error);

// Загрузка данных
async function loadData() {
  try {
    const [usersData, postsData] = await Promise.all([
      fs.readFile(USERS_FILE, 'utf8').catch(() => '[]'),
      fs.readFile(POSTS_FILE, 'utf8').catch(() => '[]')
    ]);
    return {
      users: JSON.parse(usersData),
      posts: JSON.parse(postsData)
    };
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return { users: [], posts: [] };
  }
}

// Сохранение данных
async function saveData(data) {
  try {
    await Promise.all([
      fs.writeFile(USERS_FILE, JSON.stringify(data.users, null, 2)),
      fs.writeFile(POSTS_FILE, JSON.stringify(data.posts, null, 2))
    ]);
  } catch (error) {
    console.error('Ошибка сохранения данных:', error);
  }
}

// Инициализация данных
async function initData() {
  try {
    const data = await loadData();
    if (data.users.length === 0) {
      console.log('Загружаем начальные данные...');
      
      // Используем динамический импорт для fetch
      const { default: fetch } = await import('node-fetch');
      
      const [usersRes, postsRes] = await Promise.all([
        fetch('https://jsonplaceholder.typicode.com/users'),
        fetch('https://jsonplaceholder.typicode.com/posts')
      ]);
      data.users = await usersRes.json();
      data.posts = await postsRes.json();
      await saveData(data);
      console.log('Данные загружены!');
    }
  } catch (error) {
    console.error('Ошибка инициализации:', error);
  }
}

// Или упрощенная версия без fetch:
async function initDataSimple() {
  try {
    const data = await loadData();
    if (data.users.length === 0) {
      console.log('Использую тестовые данные...');
      
      // Статические тестовые данные
      data.users = [
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          address: {
            street: "Kulas Light",
            suite: "Apt. 556",
            city: "Gwenborough",
            zipcode: "92998-3874",
            geo: { lat: "-37.3159", lng: "81.1496" }
          },
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
          company: {
            name: "Romaguera-Crona",
            catchPhrase: "Multi-layered client-server neural-net",
            bs: "harness real-time e-markets"
          }
        },
        {
          id: 2,
          name: "Ervin Howell",
          username: "Antonette",
          email: "Shanna@melissa.tv",
          address: {
            street: "Victor Plains",
            suite: "Suite 879",
            city: "Wisokyburgh",
            zipcode: "90566-7771",
            geo: { lat: "-43.9509", lng: "-34.4618" }
          },
          phone: "010-692-6593 x09125",
          website: "anastasia.net",
          company: {
            name: "Deckow-Crist",
            catchPhrase: "Proactive didactic contingency",
            bs: "synergize scalable supply-chains"
          }
        }
      ];
      
      data.posts = [
        {
          userId: 1,
          id: 1,
          title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
          body: "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto"
        },
        {
          userId: 1,
          id: 2,
          title: "qui est esse",
          body: "est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla"
        },
        {
          userId: 2,
          id: 3,
          title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
          body: "et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut"
        }
      ];
      
      await saveData(data);
      console.log('Тестовые данные созданы!');
    }
  } catch (error) {
    console.error('Ошибка инициализации:', error);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер работает',
    time: new Date().toISOString() 
  });
});

app.get('/api/users', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const data = await loadData();
    const user = data.users.find(u => u.id == req.params.id);
    user ? res.json(user) : res.status(404).json({ error: 'Пользователь не найден' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id/posts', async (req, res) => {
  try {
    const data = await loadData();
    const posts = data.posts.filter(p => p.userId == req.params.id);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API работает!" });
});

// Запуск сервера
app.listen(PORT, async () => {
  console.log('====================================');
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Доступные endpoints:');
  console.log(`   GET http://localhost:${PORT}/api/health`);
  console.log(`   GET http://localhost:${PORT}/api/users`);
  console.log(`   GET http://localhost:${PORT}/api/users/1`);
  console.log(`   GET http://localhost:${PORT}/api/users/1/posts`);
  console.log(`   GET http://localhost:${PORT}/api/posts`);
  console.log(`   GET http://localhost:${PORT}/api/test`);
  console.log('====================================');
  
  // Инициализируем данные
  await initDataSimple(); // Используйте эту для простоты
  // или await initData(); // Используйте эту если установите node-fetch
});