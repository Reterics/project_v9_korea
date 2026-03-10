# Backend Strategy for Korean Learning Platform

# Context

The Korean learning platform consists of several applications:

* `apps/web` — main learning application (React + TypeScript + Tailwind)
* `apps/design-system-site` — documentation and presentation for the UI design system
* `packages/design-system` — shared UI components
* `services/api-php` — backend API service

The learning platform requires the following capabilities:

### Client features

* user authentication
* tracking learning progress
* SRS (spaced repetition) state
* mastery tracking
* EXP and level system
* streaks and sessions

### Admin features

* user management
* lesson/content management
* statistics and reporting
* publishing and updating learning materials

### Development requirements

The project should support:

* **demo mode without backend**
* **fast local development**
* **version-controlled learning content**
* **controlled server-side business logic**
* **long-term data ownership**

Learning content (lessons, vocabulary, exercises, dialogs) is currently stored as JSON files.

---

# Decision

The project will use a **hybrid architecture**:

### Content Source

JSON files stored in the repository remain the **primary bootstrap content format**.

### Live Backend

A **PHP API with MySQL/MariaDB** will serve as the live backend for:

* user accounts
* progress state
* analytics
* admin tools
* lesson publishing

The frontend will interact with the backend **only through the API**, not through direct database access.

---

# Architecture Overview

```
project_v9_korea/
│
├─ apps/
│  ├─ web/                   # main learning application
│  └─ design-system-site/    # design system documentation
│
├─ packages/
│  └─ design-system/         # reusable UI component library
│
├─ services/
│  └─ api-php/               # PHP backend API
│
└─ docs/
   └─ adr/
      └─ 001-backend-strategy.md
```

---

# Data Strategy

The system separates **content data** from **user state data**.

---

# Content Domain

Content defines the learning material and is version controlled.

Initial source format: **JSON**

Examples:

* lessons
* vocabulary
* dialogs
* exercises
* Hangeul datasets

These files exist in the frontend repository for:

* demo mode
* development
* content version control
* database bootstrap

Example location:

```
apps/web/src/features/learn/content/
```

---

# Content Import Pipeline

Content JSON files can be imported into the database using a backend import tool.

Pipeline:

```
JSON content
      ↓
content validator
      ↓
importer script
      ↓
normalized database tables
```

The importer should support:

* validation
* dry-run mode
* update detection
* logging

This pipeline ensures content can evolve independently of the frontend.

---

# User State Domain

User state is stored **only in the database**.

Examples:

* users
* profiles
* sessions
* progress
* mastery
* SRS queue
* EXP and levels
* streaks
* analytics events

These values are written through the API only.

---

# API Design

The backend exposes a REST API.

Example structure:

```
/api/v1/auth
/api/v1/profile
/api/v1/progress
/api/v1/lessons
/api/v1/admin
```

API versioning (`/v1/`) is used to allow future evolution.

---

# Frontend Data Architecture

The frontend must **not be tightly coupled to one data source**.

Instead, the system uses repository interfaces.

Example:

```
apps/web/src/features/learn/data/
```

Repositories:

```
content/
  ContentRepository.ts
  JsonContentRepository.ts
  ApiContentRepository.ts

progress/
  ProgressRepository.ts
  ApiProgressRepository.ts
  LocalProgressRepository.ts

profile/
  ProfileRepository.ts
  ApiProfileRepository.ts
```

---

# Demo Mode

The application supports a **demo mode** without backend.

Demo behavior:

Content source:

```
JSON files
```

Progress storage:

```
localStorage
```

Demo mode allows the application to run without the API.

---

# Live Mode

In production:

Content:

```
PHP API
```

Progress:

```
PHP API
```

Database:

```
MySQL / MariaDB
```

All write operations occur through the backend.

---

# Authentication

The API must support authentication.

Recommended approach:

* token-based authentication
* session or JWT tokens
* role-based access

Roles:

* `user`
* `admin`

Admin endpoints must be protected.

---

# Admin Capabilities

The backend must support:

* user management
* user statistics
* progress analytics
* lesson publishing
* content import
* content updates

These features will later support a dedicated admin interface.

---

# Consequences

### Advantages

* strong backend control of business logic
* safer write access
* clean admin capabilities
* flexible development workflow
* demo mode without backend
* content version control in Git

### Tradeoffs

* additional backend infrastructure
* importer tooling required
* API maintenance required

---

# Alternatives Considered

### Client-side Firestore

Pros:

* simple setup
* fast prototyping
* managed infrastructure

Cons:

* business logic harder to control
* complex security rules
* weaker admin capabilities
* vendor lock-in

For these reasons Firestore was rejected.

---

# Future Extensions

Possible future improvements:

* content versioning
* analytics pipelines
* A/B testing for exercises
* content editor UI
* lesson marketplace
* mobile client

The chosen architecture supports these extensions.
