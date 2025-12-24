const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/database');
const path = require('path');
const fs = require('fs');

// @desc    Upload attachment
// @route   POST /api/attachments/: todoId
// @access  Private
router.post('/:todoId', protect, upload.single('file'), async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req. user.id;

    const [todos] = await db.query(
      'SELECT id FROM todos WHERE id = ?  AND user_id = ?',
      [todoId, userId]
    );

    if (todos.length === 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    if (! req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const [result] = await db. query(
      `INSERT INTO attachments (todo_id, user_id, filename, original_filename, file_path, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        todoId,
        userId,
        req.file. filename,
        req.file. originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype
      ]
    );

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: result.insertId,
        filename: req.file.filename,
        original_filename: req.file.originalname,
        file_size: req. file.size,
        mime_type: req.file.mimetype
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      error: 'Error uploading file'
    });
  }
});

// @desc    Get attachments for todo
// @route   GET /api/attachments/:todoId
// @access  Private
router.get('/:todoId', protect, async (req, res) => {
  try {
    const { todoId } = req.params;
    const userId = req.user. id;

    const [attachments] = await db.query(
      `SELECT id, filename, original_filename, file_size, mime_type, created_at 
       FROM attachments 
       WHERE todo_id = ? AND user_id = ?`,
      [todoId, userId]
    );

    res.json({
      success: true,
      data: attachments
    });

  } catch (error) {
    console.error('Get attachments error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching attachments'
    });
  }
});

// @desc    Download attachment
// @route   GET /api/attachments/download/:id
// @access  Private
router.get('/download/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [attachments] = await db.query(
      'SELECT * FROM attachments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (attachments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Attachment not found'
      });
    }

    const attachment = attachments[0];

    if (!fs.existsSync(attachment.file_path)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }

    res.download(attachment.file_path, attachment.original_filename);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Error downloading file'
    });
  }
});

// @desc    Delete attachment
// @route   DELETE /api/attachments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user. id;

    const [attachments] = await db.query(
      'SELECT * FROM attachments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (attachments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Attachment not found'
      });
    }

    const attachment = attachments[0];

    if (fs.existsSync(attachment.file_path)) {
      fs.unlinkSync(attachment. file_path);
    }

    await db.query('DELETE FROM attachments WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Attachment deleted successfully'
    });

  } catch (error) {
    console.error('Delete attachment error:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting attachment'
    });
  }
});

module.exports = router;