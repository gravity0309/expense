import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getExpenses, deleteExpense } from '../utils/api';
import AddExpenseModal from '../components/AddExpenseModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getExpenses();
        console.log("API RESPONSE:", res);

        const data = res?.data;

        if (data?.success && Array.isArray(data.expenses)) {
          setExpenses(data.expenses);
        } else {
          setExpenses([]);
        }
      } catch (err) {
        console.log("ERROR:", err);
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError("Failed to load expenses");
        }
      }
    };

    fetchExpenses();
  }, [logout, navigate]);

  // ✅ SAFE CALCULATION
  const total = (expenses || []).reduce((sum, e) => {
    return sum + (Number(e?.amount) || 0);
  }, 0);

  return (
    <div style={{ padding: "20px" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dashboard</h2>
        <button onClick={() => {
          logout();
          navigate('/login');
        }}>
          Logout
        </button>
      </div>

      <p>Welcome, {user?.name || "User"}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Total: ₹{total}</h3>

      {/* ✅ ADD BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          margin: "10px 0",
          padding: "10px",
          background: "green",
          color: "white"
        }}
      >
        + Add Expense
      </button>

      {/* ✅ MODAL */}
      {showModal && (
        <AddExpenseModal
          onClose={() => setShowModal(false)}
          onAdded={(newExpense) => {
            console.log("NEW EXP:", newExpense);

            if (!newExpense) return;

            const exp = newExpense.data || newExpense;

            setExpenses((prev) => [exp, ...prev]);
          }}
        />
      )}

      {/* List */}
      <ul>
        {(expenses || []).map((e, i) => (
          <li key={e?._id || i}>
            ₹{e?.amount || 0} - {e?.category || "No category"}

            {/* ✅ DELETE */}
            <button
              onClick={async () => {
                try {
                  await deleteExpense(e._id);
                  setExpenses((prev) =>
                    prev.filter((x) => x._id !== e._id)
                  );
                } catch {
                  alert("Delete failed");
                }
              }}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}