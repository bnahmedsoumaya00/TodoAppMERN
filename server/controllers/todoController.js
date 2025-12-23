const db = require('../config/database');

// @desc    Get all todos for current user
// @route   GET /api/todos
// @access  Private
const getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, category, search } = req.query;
    
    let query = 'SELECT * FROM todos WHERE user_id = ?';
    const params = [userId];
    
    // Filter by status
    if (status === 'active') {
      query += ' AND completed = FALSE';
    } else if (status === 'completed') {
      query += ' AND completed = TRUE';
    }
    
    // Filter by priority
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    
    // Filter by category
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    // Search in title and description
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    // Order by created date (newest first)
    query += ' ORDER BY created_at DESC';
    
    const [todos] = await db.query(query, params);
    
    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
    
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching todos'
    });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      data: todos[0]
    });
    
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, category, due_date } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    const [result] = await db.query(
      `INSERT INTO todos (user_id, title, description, priority, category, due_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title.trim(),
        description || null,
        priority || 'medium',
        category || 'general',
        due_date || null
      ]
    );
    
    // Get the created todo
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todos[0]
    });
    
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating todo'
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, description, priority, category, due_date, completed } = req.body;
    
    // Check if todo exists and belongs to user
    const [existing] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    // Update todo
    await db.query(
      `UPDATE todos 
       SET title = ?, description = ?, priority = ?, category = ?, due_date = ?, completed = ?
       WHERE id = ? AND user_id = ?`,
      [
        title || existing[0].title,
        description !== undefined ? description : existing[0].description,
        priority || existing[0].priority,
        category || existing[0].category,
        due_date !== undefined ? due_date : existing[0].due_date,
        completed !== undefined ? completed : existing[0].completed,
        id,
        userId
      ]
    );
    
    // Get updated todo
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todos[0]
    });
    
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating todo'
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if todo exists and belongs to user
    const [existing] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    await db.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting todo'
    });
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if todo exists and belongs to user
    const [existing] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    const newCompleted = !existing[0].completed;
    const completedAt = newCompleted ? new Date() : null;
    
    await db.query(
      'UPDATE todos SET completed = ?, completed_at = ? WHERE id = ? AND user_id = ?',
      [newCompleted, completedAt, id, userId]
    );
    
    // Get updated todo
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: `Todo marked as ${newCompleted ? 'completed' : 'active'}`,
      data: todos[0]
    });
    
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling todo'
    });
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Total todos
    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ?',
      [userId]
    );
    
    // Completed todos
    const [completed] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = TRUE',
      [userId]
    );
    
    // Active todos
    const [active] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = FALSE',
      [userId]
    );
    
    // Overdue todos
    const [overdue] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = FALSE AND due_date < CURDATE()',
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        total: total[0].count,
        completed: completed[0].count,
        active: active[0].count,
        overdue: overdue[0].count
      }
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete,
  getTodoStats
};