const db = require('../config/database');

// @desc    Get all categories for current user
// @route   GET /api/categories
// @access  Private
const getAllCategories = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE user_id = ?  ORDER BY name ASC',
      [userId]
    );
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
    
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching categories'
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, color, icon } = req.body;
    
    // Validate required fields
    if (! name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }
    
    // Check if category already exists for this user
    const [existing] = await db.query(
      'SELECT id FROM categories WHERE user_id = ?  AND name = ?',
      [userId, name. trim()]
    );
    
    if (existing.length > 0) {
      return res. status(400).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }
    
    const [result] = await db.query(
      'INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ? )',
      [userId, name. trim(), color || '#8B5CF6', icon || 'folder']
    );
    
    // Get the created category
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [result. insertId]
    );
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: categories[0]
    });
    
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating category'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, color, icon } = req.body;
    
    // Check if category exists and belongs to user
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ? AND user_id = ? ',
      [id, userId]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Update category
    await db.query(
      'UPDATE categories SET name = ?, color = ?, icon = ? WHERE id = ? AND user_id = ?',
      [name || categories[0].name, color || categories[0].color, icon || categories[0].icon, id, userId]
    );
    
    // Get updated category
    const [updated] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated[0]
    });
    
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error:  'Server error while updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if category exists and belongs to user
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE id = ? AND user_id = ? ',
      [id, userId]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Update todos to default category before deleting
    await db.query(
      'UPDATE todos SET category = ?  WHERE user_id = ? AND category = ? ',
      ['general', userId, categories[0].name]
    );
    
    // Delete category
    await db. query(
      'DELETE FROM categories WHERE id = ? AND user_id = ? ',
      [id, userId]
    );
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error:  'Server error while deleting category'
    });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};