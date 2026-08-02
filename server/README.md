# Expense Management System — Server

Express + MongoDB backend for the Expense Management System.

**Deployed on:** [Render](https://expense-management-system-backend-cbh2.onrender.com)  
**Full docs:** [Root README](../README.md)

---

## Tech

| Package | Purpose |
|---|---|
| Express | HTTP server & routing |
| Mongoose | MongoDB ODM |
| jsonwebtoken | JWT generation & verification |
| bcryptjs | Password hashing |
| cookie-parser | Read httpOnly JWT cookie |
| cors | Cross-origin requests from Vercel frontend |
| express-rate-limit | Auth endpoint rate limiting |
| morgan | HTTP request logging |
| dotenv | Environment variable loading |

---

## Quick Start

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev            # nodemon — auto-restarts on file change
```

**`.env` variables:**

```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URLS=http://localhost:3000
NODE_ENV=development
```

> For production set `CLIENT_URLS` to your Vercel frontend URL and `NODE_ENV=production`.

---

## API Endpoints

All transaction routes require a valid JWT cookie (set automatically on login).

### Auth — `/api/v1/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ✗ | Create account (rate-limited) |
| `POST` | `/login` | ✗ | Login & set JWT cookie (rate-limited) |
| `POST` | `/logout` | ✗ | Clear JWT cookie |
| `POST` | `/demo-login` | ✗ | Start a 2-hour demo session (rate-limited) |
| `PUT` | `/update-password` | ✓ | Change account password |

### Transactions — `/api/v1/transactions`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/get-transactions` | ✓ | Fetch filtered transactions |
| `POST` | `/add-transaction` | ✓ | Add a transaction |
| `POST` | `/edit-transaction` | ✓ | Edit a transaction |
| `POST` | `/delete-transaction` | ✓ | Delete a transaction |
| `POST` | `/delete-all-transactions` | ✓ Demo only | Clear all demo transactions |

### Health

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | ✗ | Returns `{ status: "ok" }` |

---

## Project Structure

```
server/
├── app.js                  # Express app setup (CORS, middleware, routes)
├── server.js               # Entry point — connects to MongoDB, starts server
├── controllers/
│   ├── transactionCtrl.js  # Transaction CRUD + deleteAll logic
│   └── userController.js   # Auth, demo login, password update
├── middleware/
│   └── authMiddleware.js   # Verifies JWT cookie, attaches req.userId
├── models/
│   ├── transactionModel.js # Transaction schema with enum validation
│   └── userModel.js        # User schema with TTL index for demo cleanup
├── routes/
│   ├── transactionRoutes.js
│   └── userRoute.js        # Rate-limited auth routes
├── scripts/
│   └── seedTransactions.js # Manual seed script (npm run seed)
└── utils/
    └── demoData.js         # Generates 12 pre-seeded demo transactions
```

---

## Deployment (Render)

The backend is deployed as a **Node.js web service** on Render. See [`render.yaml`](../render.yaml) for the service definition.

Required environment variables to set in the Render dashboard:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `8000` |
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random secret string |
| `CLIENT_URLS` | `https://expense-management-system-bice.vercel.app` |
