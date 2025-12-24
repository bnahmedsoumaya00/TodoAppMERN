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

// Health check - BEFORE migrations
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

// Routes
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/attachments', attachmentRoutes);

const PORT = process.env.PORT || 5000;

// Start server - bind to 0.0.0.0 for Railway
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
    console.error('⚠️  Migration failed, but server is running:', error.message);
  }
});