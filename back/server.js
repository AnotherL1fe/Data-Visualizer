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

let users = [
  { id: 1, name: "John Doe", email: "john@example.com", username: "johndoe" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", username: "janesmith" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", username: "bobjohnson" }
];

let posts = [
  { userId: 1, id: 1, title: "First Post", body: "This is my first post", createdAt: new Date().toISOString() },
  { userId: 1, id: 2, title: "Second Post", body: "This is my second post", createdAt: new Date().toISOString() },
  { userId: 2, id: 3, title: "Hello World", body: "Just saying hello to everyone", createdAt: new Date().toISOString() }
];

// Получить всех пользователей
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Получить пользователя по ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  res.json(user || { error: 'User not found' });
});

// Получить посты пользователя
app.get('/api/users/:id/posts', (req, res) => {
  const userPosts = posts.filter(p => p.userId == req.params.id);
  res.json(userPosts);
});

// ✅ ДОБАВЬТЕ ЭТОТ ENDPOINT - Создать новый пост
app.post('/api/posts', (req, res) => {
  try {
    const { userId, title, body } = req.body;
    
    // Валидация
    if (!userId || !title || !body) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields: userId, title, body' 
      });
    }
    
    // Проверяем существование пользователя
    const userExists = users.find(u => u.id == userId);
    if (!userExists) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Создаем новый пост
    const newPost = {
      userId: parseInt(userId),
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString()
    };
    
    posts.push(newPost);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post: newPost
    });
    
    console.log(`✅ New post created: ID ${newPost.id} for user ${userId}`);
    
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

// Получить все посты
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Проверка здоровья
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    stats: {
      users: users.length,
      posts: posts.length
    }
  });
});

// Обновить пост
app.put('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Post not found' 
    });
  }
  
  const { title, body } = req.body;
  
  if (title) posts[postIndex].title = title;
  if (body) posts[postIndex].body = body;
  
  res.json({ 
    success: true, 
    post: posts[postIndex] 
  });
});

// Удалить пост
app.delete('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex === -1) {
    return res.status(404).json({ 
      success: false,
      error: 'Post not found' 
    });
  }
  
  posts.splice(postIndex, 1);
  res.json({ 
    success: true, 
    message: 'Post deleted' 
  });
});

app.listen(5000, () => {
  console.log('====================================');
  console.log('✅ Backend запущен на http://localhost:5000');
  console.log('');
  console.log('📝 Доступные endpoints:');
  console.log('   GET    /api/health');
  console.log('   GET    /api/users');
  console.log('   GET    /api/users/:id');
  console.log('   GET    /api/users/:id/posts');
  console.log('   ✅ POST    /api/posts - создать новый пост');
  console.log('   GET    /api/posts');
  console.log('   PUT    /api/posts/:id - обновить пост');
  console.log('   DELETE /api/posts/:id - удалить пост');
  console.log('====================================');
});