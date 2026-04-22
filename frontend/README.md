# 💸 ExpenseTrack — React Frontend

A clean, dark-themed React frontend for the Personal Expense Manager MERN app.

## 📁 Structure
```
src/
├── context/AuthContext.js      # JWT auth state + localStorage
├── utils/api.js                # Axios instance + all API calls
├── pages/
│   ├── Login.js / Auth.module.css
│   ├── Register.js
│   └── Dashboard.js / Dashboard.module.css
├── components/
│   ├── AddExpenseModal.js      # Modal form to add expense
│   ├── AddExpenseModal.module.css
│   ├── ExpenseCard.js          # Single expense row
│   └── ExpenseCard.module.css
├── App.js                      # Routes + protected route guard
├── index.js
└── index.css                   # CSS variables + global reset
```

## ⚙️ Setup Locally

```bash
npm install
# Set your Render backend URL in .env:
# REACT_APP_API_URL=https://your-app.onrender.com
npm start
```

Open http://localhost:3000

## 🚀 Deploy on Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/expense-frontend.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Framework: **Create React App**
4. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: `https://your-render-backend-url.onrender.com`
5. Click **Deploy**

> `vercel.json` is already included to handle React Router's client-side routing.

## 🔗 API Endpoints Used
| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET  | `/api/expenses` | Bearer Token |
| POST | `/api/expenses` | Bearer Token |
| DELETE | `/api/expenses/:id` | Bearer Token |

## ✨ Features
- Register & Login with JWT stored in localStorage
- Dashboard with 4 stat cards (Total, Count, Top Category, Average)
- Filter expenses by category (bonus)
- Add expense via modal form
- Delete expense with confirmation dialog
- Fully responsive (mobile + desktop)
