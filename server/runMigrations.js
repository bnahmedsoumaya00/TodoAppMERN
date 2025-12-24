const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigrations() {
  let connection;
  
  try {
    console.log('🚀 Starting database migrations...\n');
    
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || process.env. MYSQLHOST || 'localhost',
      user: process.env. DB_USER || process.env. MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env. DB_NAME || process.env. MYSQLDATABASE || 'todo_app',
      port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
      multipleStatements: true // Allow multiple SQL statements
    });

    console.log('✅ Connected to database\n');

    // Read SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Executing schema. sql...\n');

    // Execute all SQL statements
    await connection.query(schema);

    console.log('✅ Schema executed successfully!\n');

    // Show tables
    console.log('📋 Database Tables: ');
    const [tables] = await connection.query('SHOW TABLES');
    console.table(tables);

    // Show todos table structure
    console.log('\n📋 Todos Table Structure:');
    const [columns] = await connection.query('DESCRIBE todos');
    console.table(columns. map(col => ({
      Field: col.Field,
      Type: col.Type,
      Null: col.Null,
      Key: col.Key,
      Default: col.Default
    })));

    console.log('\n🎉 All migrations completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Migration failed: ');
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.sqlMessage) console.error('SQL Message:', error.sqlMessage);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('✅ Database connection closed\n');
    }
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error.message);
      process.exit(1);
    });
}

module.exports = { runMigrations };