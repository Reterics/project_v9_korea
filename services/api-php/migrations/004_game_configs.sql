-- Game configuration table for admin-editable game settings

CREATE TABLE IF NOT EXISTS game_configs (
  game_id VARCHAR(50) PRIMARY KEY,
  total_questions INT NOT NULL DEFAULT 10,
  time_limit_sec INT DEFAULT NULL,
  difficulty ENUM('easy','normal','hard') DEFAULT 'normal',
  engine_config JSON DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed defaults (INSERT IGNORE skips if already exists)
INSERT IGNORE INTO game_configs (game_id, total_questions, difficulty) VALUES
  ('flashcards', 10, 'normal'),
  ('sentence_builder', 8, 'normal'),
  ('particles', 10, 'normal');
