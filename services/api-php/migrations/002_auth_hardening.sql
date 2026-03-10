-- Auth hardening: rate limits, refresh tokens, login attempts tracking

CREATE TABLE IF NOT EXISTS rate_limits (
    ip VARCHAR(45) NOT NULL,
    action VARCHAR(50) NOT NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    window_start INT UNSIGNED NOT NULL,
    PRIMARY KEY (ip, action),
    INDEX idx_window (window_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at INT UNSIGNED NOT NULL,
    created_at INT UNSIGNED NOT NULL,
    revoked_at INT UNSIGNED DEFAULT NULL,
    replaced_by BIGINT UNSIGNED DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Normalize existing emails to lowercase
UPDATE users SET email = LOWER(email);
