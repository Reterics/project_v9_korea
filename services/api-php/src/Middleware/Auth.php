<?php

namespace App\Middleware;

use App\Database;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth
{
    private const ACCESS_TOKEN_MINUTES = 15;
    private const REFRESH_TOKEN_DAYS = 30;
    private const BCRYPT_COST = 12;

    // --- Token verification ---

    public static function requireAuth(): ?array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(.+)$/', $header, $m)) {
            http_response_code(401);
            echo json_encode(['error' => 'Missing or invalid authorization header']);
            exit;
        }

        try {
            $decoded = JWT::decode($m[1], new Key($_ENV['JWT_SECRET'], 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid or expired token']);
            exit;
        }
    }

    public static function requireAdmin(): array
    {
        $user = self::requireAuth();
        if (($user['role'] ?? '') !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Admin access required']);
            exit;
        }
        return $user;
    }

    // --- Token creation ---

    public static function createAccessToken(int $userId, string $role): string
    {
        $now = time();
        $payload = [
            'sub' => $userId,
            'role' => $role,
            'iat' => $now,
            'exp' => $now + (self::ACCESS_TOKEN_MINUTES * 60),
            'type' => 'access',
        ];
        return JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
    }

    public static function createRefreshToken(int $userId): string
    {
        $token = bin2hex(random_bytes(32));
        $hash = hash('sha256', $token);
        $now = time();
        $expiresAt = $now + (self::REFRESH_TOKEN_DAYS * 86400);

        $db = Database::connection();
        $db->prepare(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?)'
        )->execute([$userId, $hash, $expiresAt, $now]);

        return $token;
    }

    /**
     * Create both access and refresh tokens.
     * Returns ['accessToken' => ..., 'refreshToken' => ...].
     */
    public static function createTokenPair(int $userId, string $role): array
    {
        return [
            'accessToken' => self::createAccessToken($userId, $role),
            'refreshToken' => self::createRefreshToken($userId),
        ];
    }

    /**
     * Validate a refresh token and issue a new pair (rotation).
     * The old refresh token is revoked.
     */
    public static function rotateRefreshToken(string $refreshToken): ?array
    {
        $hash = hash('sha256', $refreshToken);
        $db = Database::connection();

        $stmt = $db->prepare(
            'SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at, u.role
             FROM refresh_tokens rt
             JOIN users u ON u.id = rt.user_id
             WHERE rt.token_hash = ?'
        );
        $stmt->execute([$hash]);
        $row = $stmt->fetch();

        if (!$row) return null;

        // Already revoked — possible token theft, revoke entire family
        if ($row['revoked_at'] !== null) {
            $db->prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL')
                ->execute([time(), $row['user_id']]);
            return null;
        }

        // Expired
        if ((int) $row['expires_at'] < time()) {
            $db->prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?')
                ->execute([time(), $row['id']]);
            return null;
        }

        // Rotate: revoke old, issue new pair
        $newPair = self::createTokenPair((int) $row['user_id'], $row['role']);
        $newHash = hash('sha256', $newPair['refreshToken']);

        // Find the new refresh token row to link
        $newStmt = $db->prepare('SELECT id FROM refresh_tokens WHERE token_hash = ?');
        $newStmt->execute([$newHash]);
        $newRow = $newStmt->fetch();

        $db->prepare('UPDATE refresh_tokens SET revoked_at = ?, replaced_by = ? WHERE id = ?')
            ->execute([time(), $newRow['id'] ?? null, $row['id']]);

        return [
            'userId' => (int) $row['user_id'],
            'tokens' => $newPair,
        ];
    }

    /**
     * Revoke all refresh tokens for a user (logout everywhere).
     */
    public static function revokeAllTokens(int $userId): void
    {
        $db = Database::connection();
        $db->prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL')
            ->execute([time(), $userId]);
    }

    // --- Password hashing ---

    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => self::BCRYPT_COST]);
    }

    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    // --- Validation ---

    /**
     * Validate password strength.
     * Returns null on success, or an error message string.
     */
    public static function validatePassword(string $password): ?string
    {
        if (mb_strlen($password) < 8) {
            return 'Password must be at least 8 characters';
        }
        if (mb_strlen($password) > 128) {
            return 'Password must not exceed 128 characters';
        }
        if (!preg_match('/[a-zA-Z]/', $password)) {
            return 'Password must contain at least one letter';
        }
        if (!preg_match('/[0-9]/', $password)) {
            return 'Password must contain at least one digit';
        }
        return null;
    }

    /**
     * Normalize email: lowercase, trim.
     */
    public static function normalizeEmail(string $email): string
    {
        return mb_strtolower(trim($email));
    }

    /**
     * Sanitize display name: trim, strip tags, enforce length.
     */
    public static function sanitizeDisplayName(string $name): string
    {
        $name = trim(strip_tags($name));
        if (mb_strlen($name) > 50) {
            $name = mb_substr($name, 0, 50);
        }
        return $name;
    }
}
