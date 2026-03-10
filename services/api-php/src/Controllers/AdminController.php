<?php

namespace App\Controllers;

use App\Database;
use App\Middleware\Auth;
use App\Response;

class AdminController
{
    public static function listUsers(): void
    {
        Auth::requireAdmin();
        $db = Database::connection();

        $stmt = $db->query(
            'SELECT u.id, u.email, u.display_name, u.role, u.created_at, u.last_active_at,
                    p.xp, p.level, p.daily_streak
             FROM users u LEFT JOIN profiles p ON p.user_id = u.id
             ORDER BY u.created_at DESC'
        );

        $users = [];
        foreach ($stmt->fetchAll() as $row) {
            $users[] = [
                'id' => (int) $row['id'],
                'email' => $row['email'],
                'displayName' => $row['display_name'],
                'role' => $row['role'],
                'createdAt' => (int) $row['created_at'],
                'lastActiveAt' => (int) $row['last_active_at'],
                'xp' => (int) ($row['xp'] ?? 0),
                'level' => (int) ($row['level'] ?? 1),
                'dailyStreak' => (int) ($row['daily_streak'] ?? 0),
            ];
        }

        Response::json($users);
    }

    public static function getUserStats(array $params): void
    {
        Auth::requireAdmin();
        $db = Database::connection();
        $userId = (int) $params['id'];

        $progressStmt = $db->prepare(
            'SELECT COUNT(*) as total_items,
                    SUM(seen_count) as total_reviews,
                    SUM(correct_count) as total_correct,
                    AVG(mastery) as avg_mastery
             FROM progress WHERE user_id = ?'
        );
        $progressStmt->execute([$userId]);
        $stats = $progressStmt->fetch();

        $lessonStmt = $db->prepare(
            'SELECT status, COUNT(*) as cnt FROM lesson_progress WHERE user_id = ? GROUP BY status'
        );
        $lessonStmt->execute([$userId]);
        $lessonStats = [];
        foreach ($lessonStmt->fetchAll() as $row) {
            $lessonStats[$row['status']] = (int) $row['cnt'];
        }

        Response::json([
            'userId' => $userId,
            'progress' => [
                'totalItems' => (int) ($stats['total_items'] ?? 0),
                'totalReviews' => (int) ($stats['total_reviews'] ?? 0),
                'totalCorrect' => (int) ($stats['total_correct'] ?? 0),
                'avgMastery' => round((float) ($stats['avg_mastery'] ?? 0), 3),
            ],
            'lessons' => $lessonStats,
        ]);
    }

    public static function updateUserRole(array $params): void
    {
        Auth::requireAdmin();
        $body = Response::body();
        $role = $body['role'] ?? '';

        if (!in_array($role, ['user', 'admin'])) {
            Response::error('Invalid role', 422);
            return;
        }

        $db = Database::connection();
        $db->prepare('UPDATE users SET role = ? WHERE id = ?')
            ->execute([$role, $params['id']]);

        Response::json(['ok' => true]);
    }
}
