const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');

// GET /api/expenses
router.get('/', protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });

    res.json({
      success: true,
      expenses
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses'
    });
  }
});


// POST /api/expenses
router.post('/', protect, async (req, res) => {
  try {
    const newExpense = await Expense.create({
      ...req.body,
      user: req.user.id
    });

    res.json({
      success: true,
      expense: newExpense
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error adding expense'
    });
  }
});


// DELETE /api/expenses/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense deleted'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Error deleting expense'
    });
  }
});

module.exports = router;