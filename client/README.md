# Expense Management System — Client

React 18 frontend for the Expense Management System, built with Ant Design v5, Recharts, Axios, and React Router v6.

**Live:** [expense-management-system-bice.vercel.app](https://expense-management-system-bice.vercel.app/login)  
**Design (Google Stitch):** [View Stitch Project →](https://stitch.withgoogle.com/projects/8842764260137375966)  
**Full docs:** [Root README](../README.md)

---

## Tech

| Package | Purpose |
|---|---|
| React 18 | UI framework |
| Ant Design v5 | Component library |
| Recharts | Analytics charts (area, donut, bar) |
| Axios | HTTP client |
| React Router v6 | Client-side routing |
| Day.js | Date handling in forms |

---

## Quick Start

```bash
cd client
npm install
npm start
```

Create a `.env.development` file:

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

For production builds, `.env.production` proxies through Vercel's rewrite rules:

```env
REACT_APP_API_BASE_URL=/api/v1
```

---

## Pages & Components

| File | Description |
|---|---|
| `pages/Login.js` | Login form + Demo login button |
| `pages/Register.js` | Registration form |
| `pages/HomePage.js` | Dashboard — KPI cards, filter bar, table/analytics toggle |
| `components/FilterBar.js` | Frequency (1W/1M/1Y/Custom) & type filters, view toggle, Add button |
| `components/Analytics.js` | Three Recharts charts: area, donut, horizontal bar |
| `components/transactionModal.js` | Add / edit transaction modal |
| `components/Layout/Header.js` | App header with avatar dropdown, profile & password modals |
| `components/Layout/Footer.js` | Footer |
| `components/ErrorBoundary.js` | React error boundary |
| `components/Spinner.js` | Loading spinner |
| `utils/categories.js` | Shared category list used in modal and analytics |

---

## Deployment (Vercel)

The frontend is deployed on Vercel. API calls are proxied to the Render backend via [`vercel.json`](vercel.json):

```json
{
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://expense-management-system-backend-cbh2.onrender.com/api/v1/:path*"
    }
  ]
}
```

No separate backend Vercel deployment is needed — all `/api/v1/*` traffic is forwarded to Render automatically.
