# Expense Management System

A full-stack MERN expense tracker with JWT cookie authentication, transaction filtering, and analytics.

**Live demo:** _coming soon_  
**Design (Google Stitch / Figma):** _add your link here once ready_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Ant Design, Axios, React Router v6 |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookie) + bcryptjs |
| Deployment | Vercel (client + server) |

---

## Features

- Register & login with secure JWT cookie auth
- Add, edit, delete transactions
- Filter by frequency (last 7 days / 30 days / 1 year / custom date range)
- Filter by type (income / expense)
- Analytics view with category-wise breakdown
- Fully responsive

---

## Project Structure

```
Expense-Management-System/
├── client/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── utils/
├── server/          # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── docs/
    └── screenshots/ # UI version history
```

---

## Getting Started

### Prerequisites
- Node.js >= 16
- MongoDB (local or Atlas)

### 1. Clone the repo

```bash
git clone https://github.com/RaviPandey2002/Expense-Management-System.git
cd Expense-Management-System
```

### 2. Setup server

```bash
cd server
cp .env.example .env   # fill in your values
npm install
npm run dev
```

**Server `.env` variables:**

```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URLS=http://localhost:3000
NODE_ENV=development
```

> **Note:** The server defaults to port **8000**. Keep `PORT` in `.env` and `REACT_APP_API_BASE_URL` in the client `.env.development` in sync.

### 3. Setup client

```bash
cd client
npm install
npm start
```

**Client `.env.development` variable:**

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Design Process

This project was visually redesigned using **Google Stitch** (AI-assisted UI design tool).

The original UI (v1) screenshots are preserved in [`docs/screenshots/v1/`](docs/screenshots/v1/) for reference and comparison.

| Version | Description | Link |
|---|---|---|
| v1 | Original UI — functional but basic | See [`docs/screenshots/v1/`](docs/screenshots/v1/) |
| v2 | Redesigned UI — Google Stitch assisted | _Add your Stitch / Figma link here_ |

> **Why document this?** Tracking design iterations shows a professional development workflow — from working software → clean code → polished UI.

---

## Contributing

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

Distributed under the [MIT License](LICENSE).

---

## Contact

**Ravi Pandey**  
- LinkedIn: [linkedin.com/in/ravi-pandey-52a20b217](https://www.linkedin.com/in/ravi-pandey-52a20b217/)
- Email: Ravi2001pandey@gmail.com
- GitHub: [github.com/RaviPandey2002/Expense-Management-System](https://github.com/RaviPandey2002/Expense-Management-System)
