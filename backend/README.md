# 💰 Personal Expense Manager — Backend (MERN Stack)

## 📁 Project Structure
```
expense-backend/
├── config/
│   └── db.js               # MongoDB connection
├── middleware/
│   └── authMiddleware.js   # JWT verification middleware
├── models/
│   ├── User.js             # User schema (bcrypt hashed password)
│   └── Expense.js          # Expense schema
├── routes/
│   ├── authRoutes.js       # POST /register, POST /login
│   └── expenseRoutes.js    # POST /expense, GET /expenses, DELETE /expense/:id
├── .env.example            # Environment variable template
├── package.json
└── server.js               # Entry point
```

## ⚙️ Setup & Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 3. Run the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## 🔗 API Reference

### Auth Routes

| Method | Endpoint    | Access | Description          |
|--------|-------------|--------|----------------------|
| POST   | /register   | Public | Register a new user  |
| POST   | /login      | Public | Login & get token    |

#### POST /register
**Body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```
**Response:**
```json
{ "success": true, "token": "<jwt>", "user": { "id": "...", "name": "John Doe", "email": "john@example.com" } }
```

#### POST /login
**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```
**Response:**
```json
{ "success": true, "token": "<jwt>", "user": { ... } }
```

---

### Expense Routes (Protected — requires `Authorization: Bearer <token>`)

| Method | Endpoint        | Access    | Description                    |
|--------|-----------------|-----------|--------------------------------|
| POST   | /expense        | Protected | Add new expense                |
| GET    | /expenses       | Protected | Get all expenses (with filters)|
| DELETE | /expense/:id    | Protected | Delete an expense by ID        |

#### POST /expense
**Headers:** `Authorization: Bearer <token>`  
**Body:**
```json
{
  "title": "Lunch",
  "amount": 250,
  "category": "Food",
  "date": "2024-06-15",
  "note": "Optional note"
}
```

#### GET /expenses
**Headers:** `Authorization: Bearer <token>`  
**Optional query params:**
- `?category=Food` — filter by category
- `?startDate=2024-06-01&endDate=2024-06-30` — filter by date range

**Response:**
```json
{
  "success": true,
  "count": 3,
  "totalAmount": 850,
  "categoryTotals": { "Food": 450, "Travel": 400 },
  "expenses": [ ... ]
}
```

---

## 🗂️ Expense Categories
`Food`, `Travel`, `Bills`, `Shopping`, `Health`, `Entertainment`, `Education`, `Other`

## 🔐 Authentication
- Passwords hashed using **bcryptjs** (salt rounds: 10)
- JWT tokens expire in **7 days** (configurable via `.env`)
- Protected routes require `Authorization: Bearer <token>` header
