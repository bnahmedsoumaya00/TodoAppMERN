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
    
    const isAllowed = allowedOrigins. some(allowed => {
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
  optionsSuccessStatus: 200
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

// Load routes with error handling
console.log('📦 Loading routes...');

try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/auth', authRoutes);
  console.log('✅ Auth routes loaded at /auth');
} catch (error) {
  console.error('❌ Failed to load auth routes:', error.message);
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

// Debug: List all registered routes
app._router.stack.forEach((middleware) => {
  if (middleware. route) {
    console.log(`Route: ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach((handler) => {
      if (handler.route) {
        console.log(`Route: ${Object.keys(handler. route.methods)} ${handler.route.path}`);
      }
    });
  }
});

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Listening on 0.0.0.0:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ API Ready!\n`);
  
  // Run migrations in background
  try {
    console. log('Running database migrations in background.. .');
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