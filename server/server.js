const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://todoappbysoumaya.vercel.app',
      /^https:\/\/.*\.vercel\.app$/
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus:  200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Todo API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Database test endpoint
app.get('/test-db', async (req, res) => {
  try {
    const db = require('./config/database');
    
    // Test connection
    await db.query('SELECT 1');
    
    // Check if users table exists
    const [tables] = await db.query("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      return res.json({ 
        status: 'error',
        message: 'Users table does not exist!'
      });
    }
    
    // Check users table structure
    const [columns] = await db.query('DESCRIBE users');
    
    res.json({ 
      status: 'ok',
      message: 'Database connected',
      tables: tables.length,
      usersColumns: columns.map(col => ({ 
        field: col.Field, 
        type: col.Type,
        null: col.Null,
        key: col.Key
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message,
      code: error.code
    });
  }
});

// Load routes with error handling
console.log('📦 Loading routes...');

try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes loaded at /auth');
} catch (error) {
  console.error('❌ Failed to load auth routes:', error. message);
}

try {
  const todoRoutes = require('./routes/todoRoutes');
  app.use('/todos', todoRoutes);
  console.log('✅ Todo routes loaded at /todos');
} catch (error) {
  console.error('❌ Failed to load todo routes:', error.message);
}

try {
  const categoryRoutes = require('./routes/categoryRoutes');
  app.use('/categories', categoryRoutes);
  console.log('✅ Category routes loaded at /categories');
} catch (error) {
  console.error('❌ Failed to load category routes:', error.message);
}

try {
  const attachmentRoutes = require('./routes/attachmentRoutes');
  app.use('/attachments', attachmentRoutes);
  console.log('✅ Attachment routes loaded at /attachments');
} catch (error) {
  console.error('❌ Failed to load attachment routes:', error.message);
}

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Listening on 0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ API Ready!\n`);
  
  // Run migrations in background
  try {
    console.log('Running database migrations in background...');
    const { runMigrations } = require('./runMigrations');
    await runMigrations();
    console.log('✅ Migrations completed!\n');
    
    // Start recurring task scheduler
    const { startRecurringTaskScheduler } = require('./utils/recurringTaskScheduler');
    startRecurringTaskScheduler();
  } catch (error) {
    console.error('⚠️ Migration/scheduler error:', error.message);
  }
});