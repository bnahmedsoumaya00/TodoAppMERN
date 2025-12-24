const cron = require('node-cron');
const db = require('../config/database');

// Calculate next recurrence date based on pattern
const calculateNextRecurrence = (lastDate, pattern, interval) => {
  const date = new Date(lastDate);
  
  switch (pattern) {
    case 'daily':
      date.setDate(date.getDate() + interval);
      break;
    case 'weekly': 
      date.setDate(date. getDate() + (7 * interval));
      break;
    case 'monthly': 
      date.setMonth(date. getMonth() + interval);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + interval);
      break;
    default:
      return null;
  }
  
  return date;
};

// Create recurring task instances
const processRecurringTasks = async () => {
  try {
    console.log('Processing recurring tasks...');
    
    // Get all recurring tasks that need processing
    const [recurringTasks] = await db. query(`
      SELECT * FROM todos 
      WHERE is_recurring = TRUE 
      AND (next_recurrence_date IS NULL OR next_recurrence_date <= CURDATE())
      AND (recurrence_end_date IS NULL OR recurrence_end_date >= CURDATE())
      AND (parent_id IS NULL OR parent_id = 0)
    `);
    
    for (const task of recurringTasks) {
      // Calculate next recurrence date
      const baseDate = task.next_recurrence_date || task.created_at;
      const nextDate = calculateNextRecurrence(
        baseDate,
        task. recurrence_pattern,
        task.recurrence_interval || 1
      );
      
      if (! nextDate) continue;
      
      // Check if end date has passed
      if (task.recurrence_end_date && nextDate > new Date(task.recurrence_end_date)) {
        // Mark as no longer recurring
        await db.query(
          'UPDATE todos SET is_recurring = FALSE WHERE id = ?',
          [task.id]
        );
        continue;
      }
      
      // Create new instance of the recurring task
      await db.query(`
        INSERT INTO todos (
          user_id, title, description, priority, category, 
          due_date, is_recurring, recurrence_pattern, 
          recurrence_interval, recurrence_end_date
        ) VALUES (?, ?, ?, ?, ?, ?, FALSE, NULL, NULL, NULL)
      `, [
        task.user_id,
        task.title,
        task.description,
        task.priority,
        task.category,
        nextDate,
      ]);
      
      // Update the original recurring task with next recurrence date
      await db.query(`
        UPDATE todos SET 
          last_recurrence_date = ?,
          next_recurrence_date = ? 
        WHERE id = ?
      `, [baseDate, nextDate, task.id]);
    }
    
    console.log(`Processed ${recurringTasks.length} recurring tasks`);
  } catch (error) {
    console.error('Error processing recurring tasks:', error);
  }
};

// Schedule to run every day at midnight
const startRecurringTaskScheduler = () => {
  // Run every day at 00:00
  cron.schedule('0 0 * * *', processRecurringTasks);
  
  // Also run on startup
  processRecurringTasks();
  
  console.log(' Recurring task scheduler started');
};

module.exports = {
  startRecurringTaskScheduler,
  processRecurringTasks,
  calculateNextRecurrence
};