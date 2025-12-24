const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  let connection;
  
  try {
    console.log('🚀 Starting database migrations...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env. MYSQLHOST || process.env.DB_HOST,
      user: process.env. MYSQLUSER || process.env. DB_USER,
      password:  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process. env.MYSQLDATABASE || process.env.DB_NAME,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306
    });
    
    console.log('✅ Database connected successfully!');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Executing schema. sql...');
    
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt. length > 0);
    
    for (const statement of statements) {
      await connection.query(statement);
    }
    
    console.log('✅ Schema executed successfully!');
    
    // Show all tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Database Tables:');
    console.table(tables);
    
    // Show users table structure
    const [usersColumns] = await connection.query('DESCRIBE users');
    console.log('👤 Users Table Structure:');
    console.table(usersColumns);
    
    // Show todos table structure
    const [todosColumns] = await connection.query('DESCRIBE todos');
    console.log('📋 Todos Table Structure:');
    console.table(todosColumns);
    
    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error. message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed');
    }
  }
}

module.exports = { runMigrations };

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}