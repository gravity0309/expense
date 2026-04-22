import React from 'react';
import styles from './ExpenseCard.module.css';

const CATEGORY_ICONS = {
  Food:          '🍔',
  Travel:        '✈️',
  Bills:         '📄',
  Shopping:      '🛍️',
  Health:        '💊',
  Entertainment: '🎬',
  Education:     '📚',
  Other:         '💡',
};

const CATEGORY_COLORS = {
  Food:          '#f97316',
  Travel:        '#0ea5e9',
  Bills:         '#f59e0b',
  Shopping:      '#ec4899',
  Health:        '#10b981',
  Entertainment: '#8b5cf6',
  Education:     '#3b82f6',
  Other:         '#6b7280',
};

export default function ExpenseCard({ expense, onDelete }) {
  const icon  = CATEGORY_ICONS[expense.category]  || '💡';
  const color = CATEGORY_COLORS[expense.category] || '#6b7280';

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });

  return (
    <div className={styles.card}>
      <div className={styles.iconWrap} style={{ '--c': color }}>
        <span>{icon}</span>
      </div>

      <div className={styles.info}>
        <p className={styles.title}>{expense.title}</p>
        <div className={styles.meta}>
          <span className={styles.badge} style={{ '--c': color }}>{expense.category}</span>
          <span className={styles.date}>{formatDate(expense.date)}</span>
          {expense.note && <span className={styles.note} title={expense.note}>· {expense.note}</span>}
        </div>
      </div>

      <div className={styles.right}>
        <p className={styles.amount}>₹{Number(expense.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(expense._id)}
          title="Delete expense"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
