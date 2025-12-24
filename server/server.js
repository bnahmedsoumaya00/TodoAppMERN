const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const { startRecurringTaskScheduler } = require('./utils/recurringTaskScheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env. CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Todo App API is running! ',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/attachments', attachmentRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path. join(__dirname, 'uploads')));

// Health check route
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ 
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message :  undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ Auth routes: http://localhost:${PORT}/api/auth`);
  console.log(`✅ Todo routes: http://localhost:${PORT}/api/todos`);
  console.log(`✅ Category routes: http://localhost:${PORT}/api/categories`);
  console.log(`✅ Attachment routes: http://localhost:${PORT}/api/attachments`);
  
  // Start recurring task scheduler
  startRecurringTaskScheduler();
});