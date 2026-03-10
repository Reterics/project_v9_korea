# Korean Learning Platform — PHP API

REST API backend for the Korean learning platform.

## Requirements

- PHP 8.1+
- MySQL / MariaDB
- Composer

## Setup

```bash
cd services/api-php
composer install
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

## Database

Create the database, then run migrations:

```bash
mysql -u root -e "CREATE DATABASE korean_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
composer run migrate
```

## Content Import

Import JSON content files from the frontend repository into the database:

```bash
# Dry run (validate only)
composer run import -- --dry-run --verbose

# Live import
composer run import
```

## Development Server

```bash
composer run serve
# API available at http://localhost:8080
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` — Register (email, password, confirmPassword, displayName)
- `POST /api/v1/auth/login` — Login (email, password) — returns access + refresh tokens
- `POST /api/v1/auth/refresh` — Rotate refresh token (refreshToken) — returns new token pair
- `POST /api/v1/auth/change-password` — Change password (requires auth)
- `POST /api/v1/auth/logout` — Revoke all refresh tokens (requires auth)
- `GET /api/v1/auth/me` — Get current user (requires auth)

#### Security
- **Passwords**: min 8 chars, must contain a letter and a digit, bcrypt cost 12
- **Tokens**: short-lived access JWT (15 min) + long-lived refresh token (30 days, rotated on use)
- **Rate limiting**: 10 login attempts / 15 min, 5 registrations / hour per IP
- **Refresh rotation**: reuse detection revokes the entire token family
- **Email**: normalized to lowercase, validated server-side

### Profile
- `GET /api/v1/profile` — Get user profile (requires auth)
- `PUT /api/v1/profile` — Update profile (requires auth)

### Progress
- `GET /api/v1/progress` — Get all progress (requires auth)
- `GET /api/v1/progress/due` — Get due SRS items (requires auth)
- `GET /api/v1/progress/:kind/:id` — Get item progress (requires auth)
- `POST /api/v1/progress/game-result` — Submit game result (requires auth)

### Lessons
- `GET /api/v1/lessons` — List all lessons
- `GET /api/v1/lessons/:id` — Get lesson detail
- `POST /api/v1/lessons/:id/progress` — Update lesson progress (requires auth)

### Content
- `GET /api/v1/content/words` — List words (optional `?level=A1`)
- `GET /api/v1/content/words/:id` — Get word detail

### Admin (requires admin role)
- `GET /api/v1/admin/users` — List all users
- `GET /api/v1/admin/users/:id/stats` — Get user statistics
- `PUT /api/v1/admin/users/:id/role` — Update user role
