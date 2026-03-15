<?php

namespace App\Controllers;

use App\Database;
use App\Middleware\Auth;
use App\Middleware\RateLimit;
use App\Response;

class AuthController
{
    public static function register(): void
    {
        RateLimit::check('register', 5, 3600);

        $body = Response::body();
        $email = Auth::normalizeEmail($body['email'] ?? '');
        $password = $body['password'] ?? '';
        $confirmPassword = $body['confirmPassword'] ?? '';
        $displayName = Auth::sanitizeDisplayName($body['displayName'] ?? 'Learner');

        if (empty($email)) {
            Response::error('Email is required', 422, 'EMAIL_REQUIRED');
            return;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email address', 422, 'EMAIL_INVALID');
            return;
        }
        if (empty($password)) {
            Response::error('Password is required', 422, 'PASSWORD_REQUIRED');
            return;
        }

        $passwordError = Auth::validatePassword($password);
        if ($passwordError) {
            Response::error($passwordError, 422, 'PASSWORD_WEAK');
            return;
        }

        if ($password !== $confirmPassword) {
            Response::error('Passwords do not match', 422, 'PASSWORD_MISMATCH');
            return;
        }

        if (mb_strlen($displayName) < 1) {
            $displayName = 'Learner';
        }

        $db = Database::connection();

        $existing = $db->prepare('SELECT id FROM users WHERE email = ?');
        $existing->execute([$email]);
        if ($existing->fetch()) {
            Response::error('An account with this email already exists', 409, 'EMAIL_TAKEN');
            return;
        }

        $hash = Auth::hashPassword($password);
        $now = time();

        $db->beginTransaction();

        $isFirst = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn() === 0;
        $role = $isFirst ? 'admin' : 'user';

        $stmt = $db->prepare(
            'INSERT INTO users (email, password_hash, display_name, role, created_at, last_active_at) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$email, $hash, $displayName, $role, $now, $now]);
        $userId = (int) $db->lastInsertId();

        $db->prepare(
            'INSERT INTO profiles (user_id, xp, level, coins, daily_streak, streak_updated_at) VALUES (?, 0, 1, 0, 0, 0)'
        )->execute([$userId]);

        $tokens = Auth::createTokenPair($userId, $role);

        $db->commit();

        Response::json([
            'accessToken' => $tokens['accessToken'],
            'refreshToken' => $tokens['refreshToken'],
            'user' => [
                'id' => $userId,
                'email' => $email,
                'displayName' => $displayName,
                'role' => $role,
            ],
        ], 201);
    }

    public static function login(): void
    {
        RateLimit::check('login', 10, 900);

        $body = Response::body();
        $email = Auth::normalizeEmail($body['email'] ?? '');
        $password = $body['password'] ?? '';

        if (empty($email)) {
            Response::error('Email is required', 422, 'EMAIL_REQUIRED');
            return;
        }
        if (empty($password)) {
            Response::error('Password is required', 422, 'PASSWORD_REQUIRED');
            return;
        }

        $db = Database::connection();
        $stmt = $db->prepare('SELECT id, email, password_hash, display_name, role FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user || !Auth::verifyPassword($password, $user['password_hash'])) {
            Response::error('Invalid email or password', 401, 'INVALID_CREDENTIALS');
            return;
        }

        RateLimit::reset('login');

        $db->prepare('UPDATE users SET last_active_at = ? WHERE id = ?')
            ->execute([time(), $user['id']]);

        $tokens = Auth::createTokenPair((int) $user['id'], $user['role']);

        Response::json([
            'accessToken' => $tokens['accessToken'],
            'refreshToken' => $tokens['refreshToken'],
            'user' => [
                'id' => (int) $user['id'],
                'email' => $user['email'],
                'displayName' => $user['display_name'],
                'role' => $user['role'],
            ],
        ]);
    }

    public static function refresh(): void
    {
        RateLimit::check('refresh', 30, 900);

        $body = Response::body();
        $refreshToken = $body['refreshToken'] ?? '';

        if (empty($refreshToken)) {
            Response::error('Refresh token is required', 422, 'TOKEN_REQUIRED');
            return;
        }

        $result = Auth::rotateRefreshToken($refreshToken);
        if (!$result) {
            Response::error('Invalid or expired refresh token', 401, 'TOKEN_INVALID');
            return;
        }

        $db = Database::connection();
        $stmt = $db->prepare('SELECT email, display_name, role FROM users WHERE id = ?');
        $stmt->execute([$result['userId']]);
        $user = $stmt->fetch();

        Response::json([
            'accessToken' => $result['tokens']['accessToken'],
            'refreshToken' => $result['tokens']['refreshToken'],
            'user' => [
                'id' => $result['userId'],
                'email' => $user['email'],
                'displayName' => $user['display_name'],
                'role' => $user['role'],
            ],
        ]);
    }

    public static function me(): void
    {
        $claims = Auth::requireAuth();
        $db = Database::connection();

        $stmt = $db->prepare('SELECT id, email, display_name, role, created_at FROM users WHERE id = ?');
        $stmt->execute([$claims['sub']]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::error('User not found', 404, 'USER_NOT_FOUND');
            return;
        }

        Response::json([
            'id' => (int) $user['id'],
            'email' => $user['email'],
            'displayName' => $user['display_name'],
            'role' => $user['role'],
            'createdAt' => (int) $user['created_at'],
        ]);
    }

    public static function changePassword(): void
    {
        $claims = Auth::requireAuth();
        $body = Response::body();
        $currentPassword = $body['currentPassword'] ?? '';
        $newPassword = $body['newPassword'] ?? '';
        $confirmPassword = $body['confirmPassword'] ?? '';

        if (empty($currentPassword)) {
            Response::error('Current password is required', 422, 'PASSWORD_REQUIRED');
            return;
        }

        $passwordError = Auth::validatePassword($newPassword);
        if ($passwordError) {
            Response::error($passwordError, 422, 'PASSWORD_WEAK');
            return;
        }

        if ($newPassword !== $confirmPassword) {
            Response::error('Passwords do not match', 422, 'PASSWORD_MISMATCH');
            return;
        }

        $db = Database::connection();
        $stmt = $db->prepare('SELECT password_hash FROM users WHERE id = ?');
        $stmt->execute([$claims['sub']]);
        $user = $stmt->fetch();

        if (!$user || !Auth::verifyPassword($currentPassword, $user['password_hash'])) {
            Response::error('Current password is incorrect', 401, 'INVALID_CREDENTIALS');
            return;
        }

        $newHash = Auth::hashPassword($newPassword);
        $db->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
            ->execute([$newHash, $claims['sub']]);

        Auth::revokeAllTokens((int) $claims['sub']);

        $stmt = $db->prepare('SELECT role FROM users WHERE id = ?');
        $stmt->execute([$claims['sub']]);
        $role = $stmt->fetchColumn();

        $tokens = Auth::createTokenPair((int) $claims['sub'], $role);

        Response::json([
            'accessToken' => $tokens['accessToken'],
            'refreshToken' => $tokens['refreshToken'],
        ]);
    }

    public static function logout(): void
    {
        $claims = Auth::requireAuth();
        Auth::revokeAllTokens((int) $claims['sub']);
        Response::json(['ok' => true]);
    }
}
