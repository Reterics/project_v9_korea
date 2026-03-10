<?php

namespace App\Middleware;

use App\Database;

class RateLimit
{
    /**
     * Enforce rate limiting per IP + action.
     * Uses a database table for tracking attempts.
     */
    public static function check(string $action, int $maxAttempts = 10, int $windowSeconds = 900): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $db = Database::connection();

        // Ensure table exists (created by migration, but safe-guard)
        $db->exec('CREATE TABLE IF NOT EXISTS rate_limits (
            ip VARCHAR(45) NOT NULL,
            action VARCHAR(50) NOT NULL,
            attempts INT UNSIGNED NOT NULL DEFAULT 0,
            window_start INT UNSIGNED NOT NULL,
            PRIMARY KEY (ip, action)
        )');

        $now = time();
        $stmt = $db->prepare('SELECT attempts, window_start FROM rate_limits WHERE ip = ? AND action = ?');
        $stmt->execute([$ip, $action]);
        $row = $stmt->fetch();

        if ($row) {
            $windowStart = (int) $row['window_start'];
            $attempts = (int) $row['attempts'];

            // Window expired — reset
            if ($now - $windowStart > $windowSeconds) {
                $db->prepare('UPDATE rate_limits SET attempts = 1, window_start = ? WHERE ip = ? AND action = ?')
                    ->execute([$now, $ip, $action]);
                return;
            }

            if ($attempts >= $maxAttempts) {
                $retryAfter = $windowSeconds - ($now - $windowStart);
                header("Retry-After: $retryAfter");
                http_response_code(429);
                echo json_encode([
                    'error' => 'Too many attempts. Please try again later.',
                    'retryAfter' => $retryAfter,
                ]);
                exit;
            }

            $db->prepare('UPDATE rate_limits SET attempts = attempts + 1 WHERE ip = ? AND action = ?')
                ->execute([$ip, $action]);
        } else {
            $db->prepare('INSERT INTO rate_limits (ip, action, attempts, window_start) VALUES (?, ?, 1, ?)')
                ->execute([$ip, $action, $now]);
        }
    }

    /**
     * Reset rate limit for an IP + action (e.g. after successful login).
     */
    public static function reset(string $action): void
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $db = Database::connection();
        $db->prepare('DELETE FROM rate_limits WHERE ip = ? AND action = ?')
            ->execute([$ip, $action]);
    }
}
