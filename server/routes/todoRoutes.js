const express = require('express');
const router = express.Router();
const {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete,
  getTodoStats
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Stats route (before /:id to avoid conflict)
router.get('/stats', getTodoStats);

// Main CRUD routes
router.route('/')
  .get(getAllTodos)
  .post(createTodo);

router.route('/:id')
  .get(getTodoById)
  .put(updateTodo)
  .delete(deleteTodo);

// Toggle completion
router.patch('/:id/toggle', toggleComplete);

module.exports = router;