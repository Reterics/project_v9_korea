<?php

namespace App\Controllers;

use App\Database;
use App\Middleware\Auth;
use App\Response;

class ProfileController
{
    public static function get(): void
    {
        $claims = Auth::requireAuth();
        $db = Database::connection();

        $stmt = $db->prepare(
            'SELECT p.*, u.display_name, u.created_at, u.last_active_at
             FROM profiles p JOIN users u ON u.id = p.user_id
             WHERE p.user_id = ?'
        );
        $stmt->execute([$claims['sub']]);
        $row = $stmt->fetch();

        if (!$row) {
            Response::error('Profile not found', 404);
            return;
        }

        Response::json([
            'userId' => (int) $row['user_id'],
            'displayName' => $row['display_name'],
            'createdAt' => (int) $row['created_at'],
            'lastActiveAt' => (int) $row['last_active_at'],
            'xp' => (int) $row['xp'],
            'level' => (int) $row['level'],
            'coins' => (int) $row['coins'],
            'dailyStreak' => (int) $row['daily_streak'],
            'streakUpdatedAt' => (int) $row['streak_updated_at'],
        ]);
    }

    public static function update(): void
    {
        $claims = Auth::requireAuth();
        $body = Response::body();
        $db = Database::connection();

        // Handle display name update (stored in users table)
        if (isset($body['displayName'])) {
            $name = trim((string) $body['displayName']);
            if ($name === '' || mb_strlen($name) > 100) {
                Response::error('Display name must be 1-100 characters', 422);
                return;
            }
            $db->prepare('UPDATE users SET display_name = ?, last_active_at = ? WHERE id = ?')
                ->execute([$name, time(), $claims['sub']]);
        }

        // Handle profile stats update (stored in profiles table)
        $fields = [];
        $values = [];

        foreach (['xp', 'level', 'coins', 'daily_streak', 'streak_updated_at'] as $col) {
            $camel = lcfirst(str_replace('_', '', ucwords($col, '_')));
            if (isset($body[$camel])) {
                $fields[] = "$col = ?";
                $values[] = (int) $body[$camel];
            }
        }

        if (!empty($fields)) {
            $values[] = $claims['sub'];
            $sql = 'UPDATE profiles SET ' . implode(', ', $fields) . ' WHERE user_id = ?';
            $db->prepare($sql)->execute($values);
        }

        if (empty($fields) && !isset($body['displayName'])) {
            Response::error('No fields to update', 422);
            return;
        }

        // Update user last_active_at
        if (!isset($body['displayName'])) {
            $db->prepare('UPDATE users SET last_active_at = ? WHERE id = ?')
                ->execute([time(), $claims['sub']]);
        }

        self::get();
    }
}
