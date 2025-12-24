const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { runMigrations } = require('./runMigrations');

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

// Routes - FIXED:  Use correct filenames
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/attachments', attachmentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Todo API is running',
    environment: process.env.NODE_ENV 
  });
});

const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    // Run migrations
    console.log('Running database migrations...');
    await runMigrations();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`✅ API Ready!\n`);
      
      // Start recurring task scheduler
      const { startRecurringTaskScheduler } = require('./utils/recurringTaskScheduler');
      startRecurringTaskScheduler();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error. message);
    process.exit(1);
  }
}

startServer();