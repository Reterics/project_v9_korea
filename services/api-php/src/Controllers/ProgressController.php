<?php

namespace App\Controllers;

use App\Database;
use App\Middleware\Auth;
use App\Response;

class ProgressController
{
    public static function getAll(): void
    {
        $claims = Auth::requireAuth();
        $db = Database::connection();

        $stmt = $db->prepare('SELECT * FROM progress WHERE user_id = ?');
        $stmt->execute([$claims['sub']]);
        $rows = $stmt->fetchAll();

        $result = [];
        foreach ($rows as $row) {
            $result[] = self::formatRow($row);
        }

        Response::json($result);
    }

    public static function getDue(): void
    {
        $claims = Auth::requireAuth();
        $now = (int) ($_GET['now'] ?? round(microtime(true) * 1000));
        $db = Database::connection();

        $stmt = $db->prepare('SELECT * FROM progress WHERE user_id = ? AND srs_due_at <= ?');
        $stmt->execute([$claims['sub'], $now]);
        $rows = $stmt->fetchAll();

        $result = [];
        foreach ($rows as $row) {
            $result[] = self::formatRow($row);
        }

        Response::json($result);
    }

    public static function get(array $params): void
    {
        $claims = Auth::requireAuth();
        $db = Database::connection();

        $stmt = $db->prepare('SELECT * FROM progress WHERE user_id = ? AND item_kind = ? AND item_id = ?');
        $stmt->execute([$claims['sub'], $params['kind'], $params['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            Response::error('Progress not found', 404);
            return;
        }

        Response::json(self::formatRow($row));
    }

    public static function applyGameResult(): void
    {
        $claims = Auth::requireAuth();
        $body = Response::body();
        $outcomes = $body['itemOutcomes'] ?? [];
        $db = Database::connection();

        if (empty($outcomes)) {
            Response::error('No outcomes provided', 422);
            return;
        }

        $db->beginTransaction();

        try {
            foreach ($outcomes as $outcome) {
                $kind = $outcome['ref']['kind'] ?? '';
                $id = $outcome['ref']['id'] ?? '';
                $grade = $outcome['grade'] ?? 'fail';
                $latencyMs = (int) ($outcome['latencyMs'] ?? 0);

                $stmt = $db->prepare('SELECT * FROM progress WHERE user_id = ? AND item_kind = ? AND item_id = ?');
                $stmt->execute([$claims['sub'], $kind, $id]);
                $existing = $stmt->fetch();

                $isCorrect = in_array($grade, ['easy', 'good']);
                $now = round(microtime(true) * 1000);

                if ($existing) {
                    $srs = self::computeNextSrs([
                        'intervalDays' => (int) $existing['srs_interval_days'],
                        'ease' => (float) $existing['srs_ease'],
                        'dueAt' => (int) $existing['srs_due_at'],
                    ], $grade, $now);

                    $seenCount = (int) $existing['seen_count'] + 1;
                    $correctCount = (int) $existing['correct_count'] + ($isCorrect ? 1 : 0);
                    $wrongCount = (int) $existing['wrong_count'] + ($isCorrect ? 0 : 1);
                    $mastery = min(1.0, $correctCount / max(1, $seenCount));

                    $stmt = $db->prepare(
                        'UPDATE progress SET mastery = ?, srs_interval_days = ?, srs_ease = ?, srs_due_at = ?,
                         srs_last_reviewed_at = ?, seen_count = ?, correct_count = ?, wrong_count = ?, avg_latency_ms = ?
                         WHERE user_id = ? AND item_kind = ? AND item_id = ?'
                    );
                    $stmt->execute([
                        $mastery, $srs['intervalDays'], $srs['ease'], $srs['dueAt'],
                        $now, $seenCount, $correctCount, $wrongCount, $latencyMs,
                        $claims['sub'], $kind, $id,
                    ]);
                } else {
                    $srs = self::computeNextSrs([
                        'intervalDays' => 0,
                        'ease' => 2.5,
                        'dueAt' => $now,
                    ], $grade, $now);

                    $correctCount = $isCorrect ? 1 : 0;
                    $mastery = $isCorrect ? 1.0 : 0.0;

                    $stmt = $db->prepare(
                        'INSERT INTO progress (user_id, item_kind, item_id, mastery, srs_interval_days, srs_ease,
                         srs_due_at, srs_last_reviewed_at, seen_count, correct_count, wrong_count, avg_latency_ms)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)'
                    );
                    $stmt->execute([
                        $claims['sub'], $kind, $id,
                        $mastery, $srs['intervalDays'], $srs['ease'], $srs['dueAt'], $now,
                        $correctCount, $isCorrect ? 0 : 1, $latencyMs,
                    ]);
                }
            }

            // Award XP
            $correct = (int) ($body['correct'] ?? 0);
            $xpEarned = $correct * 10 + 5;
            $coinsEarned = (int) floor($xpEarned / 2);

            $db->prepare(
                'UPDATE profiles SET xp = xp + ?, coins = coins + ?,
                 level = FLOOR((xp + ?) / 100) + 1
                 WHERE user_id = ?'
            )->execute([$xpEarned, $coinsEarned, $xpEarned, $claims['sub']]);

            // Update streak
            $now = time();
            $stmt = $db->prepare('SELECT daily_streak, streak_updated_at FROM profiles WHERE user_id = ?');
            $stmt->execute([$claims['sub']]);
            $profile = $stmt->fetch();

            $today = date('Y-m-d', $now);
            $lastDay = $profile['streak_updated_at'] > 0 ? date('Y-m-d', (int) ($profile['streak_updated_at'] / 1000)) : '';

            if ($lastDay !== $today) {
                $yesterday = date('Y-m-d', $now - 86400);
                $newStreak = ($lastDay === $yesterday) ? (int) $profile['daily_streak'] + 1 : 1;
                $db->prepare('UPDATE profiles SET daily_streak = ?, streak_updated_at = ? WHERE user_id = ?')
                    ->execute([$newStreak, $now * 1000, $claims['sub']]);
            }

            $db->prepare('UPDATE users SET last_active_at = ? WHERE id = ?')
                ->execute([$now, $claims['sub']]);

            $db->commit();

            Response::json(['ok' => true, 'xpEarned' => $xpEarned, 'coinsEarned' => $coinsEarned]);
        } catch (\Exception $e) {
            $db->rollBack();
            Response::error('Failed to apply game result', 500);
        }
    }

    private static function computeNextSrs(array $current, string $grade, float $now): array
    {
        $gradeValues = ['easy' => 5, 'good' => 4, 'hard' => 2, 'fail' => 0];
        $gradeValue = $gradeValues[$grade] ?? 0;

        $ease = $current['ease'] + (0.1 - (5 - $gradeValue) * (0.08 + (5 - $gradeValue) * 0.02));
        $ease = max(1.3, $ease);

        if ($gradeValue < 3) {
            $intervalDays = 1;
        } elseif ($current['intervalDays'] === 0) {
            $intervalDays = 1;
        } elseif ($current['intervalDays'] === 1) {
            $intervalDays = 3;
        } else {
            $intervalDays = round($current['intervalDays'] * $ease);
        }

        $dueAt = $now + $intervalDays * 24 * 60 * 60 * 1000;

        return [
            'intervalDays' => $intervalDays,
            'ease' => $ease,
            'dueAt' => $dueAt,
        ];
    }

    private static function formatRow(array $row): array
    {
        return [
            'ref' => ['kind' => $row['item_kind'], 'id' => $row['item_id']],
            'mastery' => (float) $row['mastery'],
            'srs' => [
                'intervalDays' => (int) $row['srs_interval_days'],
                'ease' => (float) $row['srs_ease'],
                'dueAt' => (int) $row['srs_due_at'],
                'lastReviewedAt' => $row['srs_last_reviewed_at'] ? (int) $row['srs_last_reviewed_at'] : null,
            ],
            'seenCount' => (int) $row['seen_count'],
            'correctCount' => (int) $row['correct_count'],
            'wrongCount' => (int) $row['wrong_count'],
            'avgLatencyMs' => $row['avg_latency_ms'] ? (int) $row['avg_latency_ms'] : null,
        ];
    }
}
