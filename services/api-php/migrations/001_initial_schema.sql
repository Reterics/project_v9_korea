-- Korean Learning Platform - Initial Schema

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL DEFAULT 'Learner',
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at BIGINT UNSIGNED NOT NULL,
    last_active_at BIGINT UNSIGNED NOT NULL,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
    user_id INT UNSIGNED PRIMARY KEY,
    xp INT UNSIGNED NOT NULL DEFAULT 0,
    level INT UNSIGNED NOT NULL DEFAULT 1,
    coins INT UNSIGNED NOT NULL DEFAULT 0,
    daily_streak INT UNSIGNED NOT NULL DEFAULT 0,
    streak_updated_at BIGINT UNSIGNED NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progress (
    user_id INT UNSIGNED NOT NULL,
    item_kind VARCHAR(20) NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    mastery DECIMAL(5,4) NOT NULL DEFAULT 0,
    srs_interval_days INT NOT NULL DEFAULT 0,
    srs_ease DECIMAL(4,2) NOT NULL DEFAULT 2.50,
    srs_due_at BIGINT NOT NULL DEFAULT 0,
    srs_last_reviewed_at BIGINT DEFAULT NULL,
    seen_count INT UNSIGNED NOT NULL DEFAULT 0,
    correct_count INT UNSIGNED NOT NULL DEFAULT 0,
    wrong_count INT UNSIGNED NOT NULL DEFAULT 0,
    avg_latency_ms INT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (user_id, item_kind, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_due (user_id, srs_due_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS words (
    id VARCHAR(50) PRIMARY KEY,
    korean VARCHAR(100) NOT NULL,
    romanization VARCHAR(100) NOT NULL,
    english VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level VARCHAR(10) NOT NULL,
    example TEXT DEFAULT NULL,
    INDEX idx_level (level),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(50) PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level VARCHAR(10) NOT NULL,
    summary TEXT NOT NULL,
    pattern_data JSON DEFAULT NULL,
    related_sentence_ids JSON DEFAULT NULL,
    practice_modes JSON DEFAULT NULL,
    next_lesson_id VARCHAR(50) DEFAULT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    INDEX idx_level (level),
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_examples (
    id VARCHAR(50) NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    english TEXT NOT NULL,
    korean TEXT NOT NULL,
    english_breakdown JSON NOT NULL,
    korean_breakdown JSON NOT NULL,
    notes JSON DEFAULT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (lesson_id, id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_explanation_blocks (
    id VARCHAR(50) NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    type ENUM('text', 'tip', 'warning') NOT NULL DEFAULT 'text',
    title VARCHAR(255) DEFAULT NULL,
    content TEXT NOT NULL,
    sort_order INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (lesson_id, id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id INT UNSIGNED NOT NULL,
    lesson_id VARCHAR(50) NOT NULL,
    status ENUM('not_started', 'in_progress', 'completed') NOT NULL DEFAULT 'not_started',
    viewed_at BIGINT DEFAULT NULL,
    completed_at BIGINT DEFAULT NULL,
    practice_count INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mastery (
    user_id INT UNSIGNED NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    score DECIMAL(5,4) NOT NULL DEFAULT 0,
    last_seen BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
