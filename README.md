# DriveEase Car Rental

Professional, desktop-first car rental **website** (not a mobile app) built as a college capstone: React + Express + MongoDB Atlas.

## Project structure

```
DRIVEEASE-CAR-RENTAL/
  public/images/          # Fleet photography
  src/                    # React website
    components/
    pages/
    data/cars.js
    services/
    context/AuthContext.jsx
    styles/
  server/                 # Express API
    config/db.js
    models/
    routes/
    middleware/
    utils/
    server.js
  .env.example
  package.json
```

## Install

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env` and fill in real values. Never commit `.env`.

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | API port (default `5000`) |
| `JWT_SECRET` | Secret for HTTP-only auth cookies |
| `CLIENT_ORIGIN` | Frontend origin (`http://localhost:5173`) |
| `COOKIE_NAME` | Auth cookie name |
| `PENDING_HOLD_MINUTES` | How long a pending booking blocks the same car |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Creates or promotes an admin on server start |

## MongoDB Atlas setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a database user.
3. Allow network access (your IP, or `0.0.0.0/0` for a local demo).
4. Copy the `mongodb+srv://…` URI into `MONGODB_URI`.
5. Start the API. It will upsert the 8-car fleet into the `cars` collection.

Collections used: `users`, `cars`, `bookings`.

## Run

Terminal 1 — API:

```bash
npm run server
```

Terminal 2 — website:

```bash
npm run dev
```

Or both:

```bash
npm run dev:all
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to port 5000 so the HTTP-only cookie stays on the same origin in development.

## Test accounts

**Customer:** use **Register** on the site (role is always `customer`).

**Admin:** set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env`, restart the server, then log in with those credentials.

Passwords are hashed with bcrypt (`bcryptjs`) and never returned by the API.

## Features

- Fleet browse with search, filters, and price sort
- Car details and booking (login required)
- Separate pickup and drop-off locations (Mumbai, Navi Mumbai, Panvel, Thane, Pune, Mumbai Airport)
- Server-side rental-day calculation and overlap checks
- Pending bookings hold availability for a limited time; confirmed bookings always block
- My Bookings shows only the logged-in user’s reservations
- Admin dashboard (users, cars, bookings, status updates)
- Payment stays `pending` so a gateway can be added later (no fake paid state)

## Limitations

- Stripe (or any payment gateway) is not implemented.
- No email or SMS notifications.
- Demo contact details in the footer are placeholders.
- You must provide a valid Atlas URI; the API will not start without MongoDB.

## API

- `POST /api/auth/register` `POST /api/auth/login` `POST /api/auth/logout` `GET /api/auth/me`
- `GET /api/cars` `GET /api/cars/:id`
- `POST /api/bookings` `GET /api/bookings` `GET /api/bookings/:id`
- `GET /api/admin/users` `GET /api/admin/cars` `GET /api/admin/bookings` `PATCH /api/admin/bookings/:id`
- Extra: `GET /api/admin/stats` for dashboard counters
