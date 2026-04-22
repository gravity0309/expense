import React, { useState } from 'react';
import { addExpense } from '../utils/api';
import styles from './AddExpenseModal.module.css';

const CATEGORIES = ['Food','Travel','Bills','Shopping','Health','Entertainment','Education','Other'];

export default function AddExpenseModal({ onClose, onAdded }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Enter a valid amount greater than 0.');
      return;
    }

    setLoading(true);

    try {
      const res = await addExpense({
        ...form,
        amount: parseFloat(form.amount),
      });

      console.log("FULL RESPONSE:", JSON.stringify(res.data, null, 2));

      const data = res?.data;

      // ✅ SAFE handling for ALL backend formats
     console.log("FULL DATA:", data);

// 🔍 Try all possible formats
let expense = null;

if (data?.expense) {
  expense = data.expense;
} else if (data?.data) {
  expense = data.data;
} else if (data?._id) {
  expense = data;
}

// ❌ If still not found → log it
if (!expense) {
  console.log("UNKNOWN RESPONSE FORMAT:", data);
  setError("Unexpected server response");
  return;
}

// ✅ Add to UI
onAdded(expense);
onClose();

      if (expense && expense._id) {
        onAdded(expense);
        onClose();
      } else {
        setError('Invalid response from server.');
      }

    } catch (err) {
      console.log("ADD ERROR:", err);
      setError(err.response?.data?.message || 'Could not add expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={styles.modal}>
        
        <div className={styles.header}>
          <h3>Add Expense</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Title</label>
              <input
                name="title"
                placeholder="e.g. Lunch"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Amount (₹)</label>
              <input
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label>Note (optional)</label>
            <input
              name="note"
              placeholder="Any notes..."
              value={form.note}
              onChange={handleChange}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? "Adding..." : "+ Add Expense"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}