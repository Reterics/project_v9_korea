-- Add sentences table for sentence builder and practice modes

CREATE TABLE IF NOT EXISTS sentences (
    id VARCHAR(50) PRIMARY KEY,
    tokens JSON NOT NULL,
    roles JSON NOT NULL,
    english TEXT NOT NULL,
    hint VARCHAR(255) DEFAULT NULL,
    level VARCHAR(10) NOT NULL,
    INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
