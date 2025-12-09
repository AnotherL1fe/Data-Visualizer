import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "your-secret-key-change-in-production";
const DATA_DIR = path.join(__dirname, "data");

// Пути к файлам данных
const USERS_FILE = path.join(DATA_DIR, "users.json");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");
const AUTH_USERS_FILE = path.join(DATA_DIR, "authUsers.json");

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Токен отсутствует" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: "Неверный токен" });
    }
    req.user = user;
    next();
  });
};

// Инициализация данных
async function initializeData() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Создаем файлы если их нет
    const files = [
      { file: USERS_FILE, defaultData: [] },
      { file: POSTS_FILE, defaultData: [] },
      { file: AUTH_USERS_FILE, defaultData: [] },
    ];

    for (const { file, defaultData } of files) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, JSON.stringify(defaultData, null, 2));
      }
    }

    console.log("✅ Данные инициализированы");
  } catch (error) {
    console.error("Ошибка инициализации:", error);
  }
}

// Загрузка данных из файлов
async function loadData() {
  try {
    const [usersData, postsData, authUsersData] = await Promise.all([
      fs.readFile(USERS_FILE, "utf8"),
      fs.readFile(POSTS_FILE, "utf8"),
      fs.readFile(AUTH_USERS_FILE, "utf8"),
    ]);

    return {
      users: JSON.parse(usersData),
      posts: JSON.parse(postsData),
      authUsers: JSON.parse(authUsersData),
    };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return { users: [], posts: [], authUsers: [] };
  }
}

// Сохранение данных в файлы
async function saveData(data) {
  try {
    await Promise.all([
      fs.writeFile(USERS_FILE, JSON.stringify(data.users, null, 2)),
      fs.writeFile(POSTS_FILE, JSON.stringify(data.posts, null, 2)),
      fs.writeFile(AUTH_USERS_FILE, JSON.stringify(data.authUsers, null, 2)),
    ]);
    return true;
  } catch (error) {
    console.error("Ошибка сохранения данных:", error);
    return false;
  }
}

// ============== АУТЕНТИФИКАЦИЯ ==============

// Регистрация
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Все поля обязательны" });
    }

    const data = await loadData();

    // Проверяем, есть ли такой пользователь
    const existingUser = data.authUsers.find(
      (u) => u.email === email || u.username === username
    );
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Пользователь с таким email или именем уже существует",
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаем нового пользователя
    const newUser = {
      id: data.authUsers.length > 0 ? Math.max(...data.authUsers.map(u => u.id)) + 1 : 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    data.authUsers.push(newUser);
    await saveData(data);

    // Создаем JWT токен
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Регистрация успешна",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Вход
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email и пароль обязательны" });
    }

    const data = await loadData();

    // Ищем пользователя
    const user = data.authUsers.find((u) => u.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Неверный email или пароль" });
    }

    // Проверяем пароль
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, error: "Неверный email или пароль" });
    }

    // Создаем JWT токен
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Вход выполнен",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Получить текущего пользователя
app.get("/api/auth/me", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();

    const user = data.authUsers.find((u) => u.id === req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Пользователь не найден" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Демо пользователь для тестирования
app.post("/api/auth/demo", async (req, res) => {
  try {
    const data = await loadData();

    // Создаем демо пользователя если его нет
    let demoUser = data.authUsers.find((u) => u.email === "demo@example.com");

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash("demo123", 10);
      demoUser = {
        id: data.authUsers.length > 0 ? Math.max(...data.authUsers.map(u => u.id)) + 1 : 1,
        username: "demo",
        email: "demo@example.com",
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      };

      data.authUsers.push(demoUser);
      await saveData(data);
    }

    // Создаем токен
    const token = jwt.sign(
      { id: demoUser.id, username: demoUser.username, email: demoUser.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Демо вход выполнен",
      user: {
        id: demoUser.id,
        username: demoUser.username,
        email: demoUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Ошибка демо входа:", error);
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// ============== API ДЛЯ ДАННЫХ ==============

// Проверка здоровья (публичный)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Сервер работает",
    timestamp: new Date().toISOString(),
  });
});

// Получить всех пользователей (защищенный)
app.get("/api/users", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();

    // Если пользователей нет, создаем демо данные
    if (data.users.length === 0) {
      data.users = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          username: "johndoe",
          address: {
            street: "123 Main St",
            city: "New York",
            zipcode: "10001",
          },
          company: {
            name: "Tech Corp",
          },
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          username: "janesmith",
          address: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            zipcode: "90001",
          },
          company: {
            name: "Business Inc",
          },
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          username: "bobjohnson",
          address: {
            street: "789 Pine Rd",
            city: "Chicago",
            zipcode: "60601",
          },
          company: {
            name: "Services LLC",
          },
        },
      ];

      await saveData(data);
    }

    res.json(data.users);
  } catch (error) {
    console.error("Ошибка получения пользователей:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получить пользователя по ID (защищенный)
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();
    const user = data.users.find((u) => u.id == req.params.id);
    res.json(user || { error: "User not found" });
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получить посты пользователя (защищенный)
app.get("/api/users/:id/posts", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();
    const userPosts = data.posts.filter((p) => p.userId == req.params.id);
    res.json(userPosts);
  } catch (error) {
    console.error("Ошибка получения постов:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получить все посты (защищенный)
app.get("/api/posts", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();
    res.json(data.posts);
  } catch (error) {
    console.error("Ошибка получения постов:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Создать новый пост (защищенный)
app.post("/api/posts", authenticateToken, async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({
        success: false,
        error: "Все поля обязательны: userId, title, body",
      });
    }

    const data = await loadData();

    // Проверяем существование пользователя
    const userExists = data.users.find((u) => u.id == userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Создаем новый пост
    const newPost = {
      userId: parseInt(userId),
      id: data.posts.length > 0 ? Math.max(...data.posts.map((p) => p.id)) + 1 : 1,
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };

    data.posts.push(newPost);
    await saveData(data);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });

    console.log(`✅ New post created: ID ${newPost.id} for user ${userId}`);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Обновить пост (защищенный)
app.put("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();
    const postId = parseInt(req.params.id);
    const postIndex = data.posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    const { title, body } = req.body;

    if (title) data.posts[postIndex].title = title;
    if (body) data.posts[postIndex].body = body;
    data.posts[postIndex].updatedAt = new Date().toISOString();

    await saveData(data);

    res.json({
      success: true,
      post: data.posts[postIndex],
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// Удалить пост (защищенный)
app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
  try {
    const data = await loadData();
    const postId = parseInt(req.params.id);
    const postIndex = data.posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Post not found",
      });
    }

    data.posts.splice(postIndex, 1);
    await saveData(data);

    res.json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// ============== ЗАПУСК СЕРВЕРА ==============

app.listen(5000, async () => {
  console.log("====================================");
  console.log("✅ Backend запущен на http://localhost:5000");
  console.log("");
  console.log("🔐 Аутентификация:");
  console.log("   POST /api/auth/register - регистрация");
  console.log("   POST /api/auth/login    - вход");
  console.log("   POST /api/auth/demo     - демо вход");
  console.log("   GET  /api/auth/me       - информация о пользователе");
  console.log("");
  console.log("📊 Данные (требуют токен):");
  console.log("   GET    /api/users           - все пользователи");
  console.log("   GET    /api/users/:id       - пользователь по ID");
  console.log("   GET    /api/users/:id/posts - посты пользователя");
  console.log("   GET    /api/posts           - все посты");
  console.log("   POST   /api/posts           - создать пост");
  console.log("   PUT    /api/posts/:id       - обновить пост");
  console.log("   DELETE /api/posts/:id       - удалить пост");
  console.log("");
  console.log("🌐 Публичные:");
  console.log("   GET    /api/health          - проверка сервера");
  console.log("====================================");

  await initializeData();
});