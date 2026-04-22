const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, note } = req.body;
    if (!title || !amount || !category)
      return res.status(400).json({ success: false, message: 'Please provide title, amount and category.' });

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount,
      category,
      date: date || Date.now(),
      note,
    });

    res.status(201).json({ success: true, expense });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ success: false, message: msg });
    }
    res.status(500).json({ success: false, message: 'Server error while adding expense.' });
  }
});

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    const filter = { userId: req.user._id };

    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryTotals = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: expenses.length,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      categoryTotals,
      expenses,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching expenses.' });
  }
});

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense)
      return res.status(404).json({ success: false, message: 'Expense not found.' });

    if (expense.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized.' });

    await expense.deleteOne();
    res.status(200).json({ success: true, message: 'Expense deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while deleting expense.' });
  }
});

module.exports = router;