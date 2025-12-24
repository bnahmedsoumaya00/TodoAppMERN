const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'todo_app'
  });

  try {
    console. log('🚀 Running migrations...\n');

    // Helper function to safely add column
    async function addColumnIfNotExists(columnName, columnDef) {
      try {
        const [columns] = await connection.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'todos' AND COLUMN_NAME = ?`,
          [process.env.DB_NAME || 'todo_app', columnName]
        );

        if (columns.length === 0) {
          await connection. query(`ALTER TABLE todos ADD COLUMN ${columnName} ${columnDef}`);
          console.log(`✅ Added column: ${columnName}`);
        } else {
          console.log(`⏭️  Column already exists: ${columnName}`);
        }
      } catch (error) {
        console.error(`❌ Error adding ${columnName}:`, error.message);
      }
    }

    // Add all columns
    await addColumnIfNotExists('parent_id', 'INT NULL');
    await addColumnIfNotExists('is_subtask', 'BOOLEAN DEFAULT FALSE');
    await addColumnIfNotExists('is_recurring', 'BOOLEAN DEFAULT FALSE');
    await addColumnIfNotExists('recurrence_pattern', 'VARCHAR(50) NULL');
    await addColumnIfNotExists('recurrence_interval', 'INT DEFAULT 1');
    await addColumnIfNotExists('recurrence_end_date', 'DATE NULL');
    await addColumnIfNotExists('last_recurrence_date', 'DATE NULL');
    await addColumnIfNotExists('next_recurrence_date', 'DATE NULL');

    // Create attachments table
    try {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS attachments (
          id INT PRIMARY KEY AUTO_INCREMENT,
          todo_id INT NOT NULL,
          user_id INT NOT NULL,
          filename VARCHAR(255) NOT NULL,
          original_filename VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size INT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (todo_id) REFERENCES todos(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
      console.log('✅ Created/verified attachments table');
    } catch (error) {
      console.error('❌ Error creating attachments table:', error.message);
    }

    // Add indexes
    try {
      await connection.query('CREATE INDEX IF NOT EXISTS idx_parent_id ON todos(parent_id)');
      console.log('✅ Created index:  idx_parent_id');
    } catch (error) {
      if (error.code !== 'ER_DUP_KEYNAME') {
        console.error('❌ Error creating index:', error.message);
      }
    }

    try {
      await connection.query('CREATE INDEX IF NOT EXISTS idx_recurring ON todos(is_recurring, next_recurrence_date)');
      console.log('✅ Created index: idx_recurring');
    } catch (error) {
      if (error.code !== 'ER_DUP_KEYNAME') {
        console.error('❌ Error creating index:', error.message);
      }
    }

    // Show final structure
    console.log('\n📋 Final todos table structure:');
    const [columns] = await connection.query('DESCRIBE todos');
    console.table(columns. map(col => ({
      Field: col.Field,
      Type: col.Type,
      Null: col.Null,
      Default: col.Default
    })));

    console.log('\n🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
  } finally {
    await connection. end();
  }
}

runMigrations();