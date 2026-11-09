# WebMarket

Full-stack e-commerce demo: a React + Redux storefront (TD-TP 2) and a Node.js /
Express / MongoDB REST API (TD-TP 3).

## Structure

```
.
├── src/        React 19 + Redux Toolkit storefront (Vite)
├── backend/    Express REST API (products, auth with JWT, rate limiting)
└── public/
```

- **Storefront:** product catalog, search, category filters, sorting, cart drawer,
  dark mode, and a login/register dialog backed by the API.
- **Backend:** product CRUD in MongoDB, user registration/login with bcrypt and JWT,
  protected write endpoints, and rate limiting. See `backend/README.md` for the full
  API documentation.

## Run locally

### 1. Backend (API on port 3000)

```bash
cd backend
npm install
cp .env.example .env     # adjust if needed
npm run seed             # optional sample products
npm start
```

Requires MongoDB. With a local install, start the **MongoDB** service first
(elevated PowerShell: `net start MongoDB`). Alternatively put your Atlas connection
string in `backend/.env`.

### 2. Frontend (Vite dev server on port 5173)

```bash
npm install
npm run dev
```

The frontend calls `http://localhost:3000/api` by default. Override it with
`VITE_API_URL` in a root `.env` file (see `.env.example`). If the API is down, the
storefront falls back to bundled sample products and shows a banner.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint the frontend with oxlint |
| `npm run seed --prefix backend` | Seed sample products |
| `npm start --prefix backend` | Start the API |

## Notes

- Passwords are stored as bcrypt hashes; JWTs are signed with `JWT_SECRET`.
- `backend/.env` and the root `.env` are gitignored — never commit real secrets.
- Prices are stored in USD and displayed in DZD on the storefront.
