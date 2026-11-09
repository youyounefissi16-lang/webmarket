# WebMarket Backend — TD-TP 3 (WAMD Module)

**Student:** youcef
**Course:** ENSTA — SS/IA, First Semester 2026 — Module: WAMD — TD-TP 3

## Application description

Backend for the **WebMarket** e-commerce application developed in TD-TP 2 (React + Redux
frontend). It provides a REST API over HTTP/JSON, stores products and users in MongoDB,
and secures write operations with JWT authentication. The React frontend communicates
only with this API — never directly with the database.

## Technologies used

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime environment |
| Express.js | Web framework for the REST API |
| MongoDB (+ Mongoose) | NoSQL database and ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT signing and verification |
| cors | Cross-origin requests from the React dev server |
| dotenv | Environment variables |
| express-rate-limit | API rate limiting |
| Postman / Thunder Client | API testing |

## Database models

### Product
| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `description` | String | |
| `price` | Number | required, ≥ 0 |
| `category` | String | required |
| `imageUrl` | String | |
| `stock` | Number | ≥ 0 |

### User
| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique (duplicate → 409) |
| `passwordHash` | String | bcrypt hash — passwords are never stored in plain text |

## API endpoints and access requirements

### Authentication
| Method | Endpoint | Access | Purpose | Success |
|---|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user | 201 |
| POST | `/api/auth/login` | Public (rate limited) | Authenticate, returns a JWT | 200 |

### Products
| Method | Endpoint | Access | Purpose | Success |
|---|---|---|---|---|
| GET | `/api/products` | Public | Retrieve all products | 200 |
| GET | `/api/products/:id` | Public | Retrieve one product | 200 |
| POST | `/api/products` | JWT required | Create a product | 201 |
| PUT | `/api/products/:id` | JWT required | Update a product | 200 |
| DELETE | `/api/products/:id` | JWT required | Delete a product | 200 |

Errors are consistent JSON: `{ "message": "..." }` with status codes
200, 201, 400, 401, 404, 409, 429, 500 as appropriate
(400 invalid input · 401 missing/invalid token · 404 unknown id ·
409 duplicate email · 429 rate limit exceeded).

## JWT authentication mechanism

1. The user registers with a name, email, and password. The password is hashed with
   bcrypt before being stored.
2. On login, the server verifies the credentials against the stored hash and, on
   success, signs a JSON Web Token (HS256) containing the user id with the
   `JWT_SECRET` environment variable and returns it as `{ "token": "..." }`.
3. The client sends the token with protected requests in the header:
   `Authorization: Bearer <JWT_TOKEN>`.
4. The `requireAuth` middleware extracts the token, verifies its signature and
   expiry, and either continues the request or returns **401 Unauthorized**.

JWTs are stateless — the token itself carries the identity, so no server-side session
store is needed. Tokens expire after 1 day.

## Rate limiting

- General API: **100 requests / 15 minutes / IP** → 429 when exceeded
- Login endpoint: **5 requests / 15 minutes / IP** → 429 when exceeded

## Setup

### 1. MongoDB

- **Local:** install MongoDB Community Server (MongoDB Compass connects to
  `mongodb://127.0.0.1:27017`). Start the **MongoDB** Windows service before running
  the API, e.g. from an elevated PowerShell: `net start MongoDB`.
- **Atlas:** create a free cluster, then use its connection string in `MONGO_URI`.

### 2. Environment variables

```bash
cp .env.example .env   # then edit the values
```

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/webmarket
JWT_SECRET=replace_with_a_long_random_local_secret
```

> The `.env` file is gitignored. Never commit real credentials or secrets.

### 3. Run

```bash
cd backend
npm install
npm run seed     # optional: insert 16 sample products (16 seed products from TD-TP 2)
npm start        # API on http://localhost:3000
# or: npm run dev (auto-reload with --watch)
```

## API testing checklist (Postman / Thunder Client)

**Authentication**
- [ ] Register a new user → 201
- [ ] Register again with the same email → 409
- [ ] Login with valid credentials → 200 + JWT
- [ ] Login with wrong password → 401
- [ ] Save the token in an `Authorization: Bearer <token>` header

**Product management**
- [ ] `GET /api/products` → 200 (list)
- [ ] `GET /api/products/:id` → 200 (single)
- [ ] `POST /api/products` with token → 201
- [ ] `PUT /api/products/:id` with token → 200
- [ ] `DELETE /api/products/:id` with token → 200

**Security and error handling**
- [ ] `POST /api/products` without a token → 401
- [ ] `POST /api/products` with an invalid token → 401
- [ ] `GET /api/products/invalid-id` → 404
- [ ] `POST /api/products` with missing fields → 400

**Rate limiting (security)**
- [ ] Send 6 logins in a row → the 6th returns 429

**OAuth 2.0 note:** OAuth 2.0 is a client-side provider flow (§8 of the lab) — use
Postman/Thunder Client's OAuth 2.0 authorization type with any provider's
authorization/token URLs to obtain an access token and send it as
`Authorization: Bearer <ACCESS_TOKEN>` to a protected endpoint. This backend itself
implements JWT authentication only.

## Project structure

```
backend/
├── .env.example
├── README.md
├── seed.js
└── src/
    ├── server.js               # entry point
    ├── app.js                  # Express app, CORS, routes
    ├── config/db.js            # MongoDB connection
    ├── models/                 # Product, User
    ├── controllers/            # auth, products
    ├── routes/                 # /api/auth, /api/products
    └── middleware/             # auth (JWT), error handler, rate limits
```
