const db = require('../config/database');

// @desc    Get all todos for current user (including subtasks)
// @route   GET /api/todos
// @access  Private
const getAllTodos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, category, search, include_subtasks } = req.query;
    
    let query = 'SELECT * FROM todos WHERE user_id = ?';
    const params = [userId];
    
    // Only get parent todos (not subtasks) by default
    if (include_subtasks !== 'true') {
      query += ' AND (parent_id IS NULL OR parent_id = 0)';
    }
    
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
    
    // For each todo, get its subtasks
    for (let todo of todos) {
      const [subtasks] = await db.query(
        'SELECT * FROM todos WHERE parent_id = ? ORDER BY created_at ASC',
        [todo.id]
      );
      todo.subtasks = subtasks;
      todo.subtask_count = subtasks.length;
      todo.completed_subtasks = subtasks.filter(st => st.completed).length;
    }
    
    res. json({
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

// @desc    Get single todo with subtasks
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ? ',
      [id, userId]
    );
    
    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    const todo = todos[0];
    
    // Get subtasks
    const [subtasks] = await db.query(
      'SELECT * FROM todos WHERE parent_id = ? ORDER BY created_at ASC',
      [id]
    );
    
    todo.subtasks = subtasks;
    todo.subtask_count = subtasks.length;
    todo.completed_subtasks = subtasks.filter(st => st. completed).length;
    
    res.json({
      success: true,
      data: todo
    });
    
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create new todo (or subtask)
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, priority, category, due_date, parent_id } = req.body;
    
    // Validate required fields
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }
    
    // If parent_id is provided, verify it exists and belongs to user
    if (parent_id) {
      const [parentTodos] = await db.query(
        'SELECT id FROM todos WHERE id = ? AND user_id = ?',
        [parent_id, userId]
      );
      
      if (parentTodos.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Parent todo not found'
        });
      }
    }
    
    const [result] = await db.query(
      `INSERT INTO todos (user_id, title, description, priority, category, due_date, parent_id, is_subtask) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        title. trim(),
        description || null,
        priority || 'medium',
        category || 'general',
        due_date || null,
        parent_id || null,
        parent_id ? true : false
      ]
    );
    
    // Get the created todo
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ? ',
      [result.insertId]
    );
    
    res.status(201).json({
      success: true,
      message: parent_id ? 'Subtask created successfully' : 'Todo created successfully',
      data:  todos[0]
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
    const { title, description, priority, category, due_date } = req.body;
    
    // Check if todo exists and belongs to user
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ? ',
      [id, userId]
    );
    
    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    const todo = todos[0];
    
    // Update todo
    await db.query(
      `UPDATE todos SET 
        title = ?, 
        description = ?, 
        priority = ?, 
        category = ?, 
        due_date = ?,
        updated_at = NOW()
      WHERE id = ? AND user_id = ?`,
      [
        title || todo.title,
        description !== undefined ? description : todo.description,
        priority || todo.priority,
        category || todo.category,
        due_date !== undefined ? due_date :  todo.due_date,
        id,
        userId
      ]
    );
    
    // Get updated todo
    const [updated] = await db.query(
      'SELECT * FROM todos WHERE id = ? ',
      [id]
    );
    
    // Get subtasks
    const [subtasks] = await db.query(
      'SELECT * FROM todos WHERE parent_id = ? ',
      [id]
    );
    
    updated[0].subtasks = subtasks;
    updated[0].subtask_count = subtasks.length;
    updated[0].completed_subtasks = subtasks.filter(st => st.completed).length;
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: updated[0]
    });
    
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating todo'
    });
  }
};

// @desc    Delete todo (and its subtasks)
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const { id } = req. params;
    const userId = req.user.id;
    
    // Check if todo exists and belongs to user
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
    
    // Delete todo (cascade will delete subtasks)
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
    
    // Get todo
    const [todos] = await db.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ? ',
      [id, userId]
    );
    
    if (todos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }
    
    const todo = todos[0];
    const newCompletedStatus = !todo.completed;
    
    // Update todo
    await db.query(
      `UPDATE todos SET 
        completed = ?, 
        completed_at = ?,
        updated_at = NOW()
      WHERE id = ? AND user_id = ?`,
      [
        newCompletedStatus,
        newCompletedStatus ? new Date() : null,
        id,
        userId
      ]
    );
    
    // If marking parent as complete, mark all subtasks as complete
    if (newCompletedStatus && ! todo.is_subtask) {
      await db.query(
        `UPDATE todos SET 
          completed = TRUE, 
          completed_at = NOW(),
          updated_at = NOW()
        WHERE parent_id = ? AND user_id = ?`,
        [id, userId]
      );
    }
    
    // Get updated todo with subtasks
    const [updated] = await db.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );
    
    const [subtasks] = await db. query(
      'SELECT * FROM todos WHERE parent_id = ?',
      [id]
    );
    
    updated[0]. subtasks = subtasks;
    updated[0].subtask_count = subtasks.length;
    updated[0].completed_subtasks = subtasks.filter(st => st.completed).length;
    
    res.json({
      success: true,
      data: updated[0]
    });
    
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({
      success: false,
      error:  'Server error while toggling todo'
    });
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
const getTodoStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total todos (excluding subtasks)
    const [totalResult] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ?  AND (parent_id IS NULL OR parent_id = 0)',
      [userId]
    );
    
    // Get completed todos
    const [completedResult] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ?  AND completed = TRUE AND (parent_id IS NULL OR parent_id = 0)',
      [userId]
    );
    
    // Get active todos
    const [activeResult] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = FALSE AND (parent_id IS NULL OR parent_id = 0)',
      [userId]
    );
    
    // Get overdue todos
    const [overdueResult] = await db.query(
      'SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = FALSE AND due_date < NOW() AND (parent_id IS NULL OR parent_id = 0)',
      [userId]
    );
    
    res.json({
      success: true,
      data: {
        total: totalResult[0].count,
        completed: completedResult[0].count,
        active: activeResult[0].count,
        overdue: overdueResult[0].count
      }
    });
    
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error:  'Server error while fetching statistics'
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