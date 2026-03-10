<?php

namespace App\Controllers;

use App\Database;
use App\Middleware\Auth;
use App\Response;

class LessonController
{
    public static function list(): void
    {
        $db = Database::connection();

        $stmt = $db->query(
            'SELECT id, slug, title, category, level, summary FROM lessons ORDER BY sort_order ASC'
        );
        $lessons = $stmt->fetchAll();

        // Optional: include user progress if authenticated
        $claims = self::optionalAuth();
        $progressMap = [];

        if ($claims) {
            $pStmt = $db->prepare('SELECT * FROM lesson_progress WHERE user_id = ?');
            $pStmt->execute([$claims['sub']]);
            foreach ($pStmt->fetchAll() as $row) {
                $progressMap[$row['lesson_id']] = [
                    'status' => $row['status'],
                    'viewedAt' => $row['viewed_at'] ? (int) $row['viewed_at'] : null,
                    'completedAt' => $row['completed_at'] ? (int) $row['completed_at'] : null,
                    'practiceCount' => (int) $row['practice_count'],
                ];
            }
        }

        $result = [];
        foreach ($lessons as $lesson) {
            $item = [
                'id' => $lesson['id'],
                'slug' => $lesson['slug'],
                'title' => $lesson['title'],
                'category' => $lesson['category'],
                'level' => $lesson['level'],
                'summary' => $lesson['summary'],
            ];

            if (isset($progressMap[$lesson['id']])) {
                $item['progress'] = $progressMap[$lesson['id']];
            }

            $result[] = $item;
        }

        Response::json($result);
    }

    public static function get(array $params): void
    {
        $db = Database::connection();

        $stmt = $db->prepare('SELECT * FROM lessons WHERE id = ?');
        $stmt->execute([$params['id']]);
        $lesson = $stmt->fetch();

        if (!$lesson) {
            Response::error('Lesson not found', 404);
            return;
        }

        $exStmt = $db->prepare('SELECT * FROM lesson_examples WHERE lesson_id = ? ORDER BY sort_order');
        $exStmt->execute([$lesson['id']]);
        $examples = [];
        foreach ($exStmt->fetchAll() as $ex) {
            $examples[] = [
                'id' => $ex['id'],
                'english' => $ex['english'],
                'korean' => $ex['korean'],
                'englishBreakdown' => json_decode($ex['english_breakdown'], true) ?? [],
                'koreanBreakdown' => json_decode($ex['korean_breakdown'], true) ?? [],
                'notes' => $ex['notes'] ? json_decode($ex['notes'], true) : null,
            ];
        }

        $blStmt = $db->prepare('SELECT * FROM lesson_explanation_blocks WHERE lesson_id = ? ORDER BY sort_order');
        $blStmt->execute([$lesson['id']]);
        $blocks = [];
        foreach ($blStmt->fetchAll() as $bl) {
            $blocks[] = [
                'id' => $bl['id'],
                'type' => $bl['type'],
                'title' => $bl['title'],
                'content' => $bl['content'],
            ];
        }

        Response::json([
            'id' => $lesson['id'],
            'slug' => $lesson['slug'],
            'title' => $lesson['title'],
            'category' => $lesson['category'],
            'level' => $lesson['level'],
            'summary' => $lesson['summary'],
            'pattern' => $lesson['pattern_data'] ? json_decode($lesson['pattern_data'], true) : null,
            'examples' => $examples,
            'explanationBlocks' => $blocks,
            'relatedSentenceIds' => json_decode($lesson['related_sentence_ids'], true) ?? [],
            'practiceModes' => json_decode($lesson['practice_modes'], true) ?? [],
            'nextLessonId' => $lesson['next_lesson_id'],
        ]);
    }

    public static function updateProgress(array $params): void
    {
        $claims = Auth::requireAuth();
        $body = Response::body();
        $action = $body['action'] ?? '';
        $db = Database::connection();
        $lessonId = $params['id'];

        $stmt = $db->prepare('SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?');
        $stmt->execute([$claims['sub'], $lessonId]);
        $existing = $stmt->fetch();

        $now = round(microtime(true) * 1000);

        if ($action === 'view') {
            if (!$existing) {
                $db->prepare(
                    'INSERT INTO lesson_progress (user_id, lesson_id, status, viewed_at, practice_count) VALUES (?, ?, ?, ?, 0)'
                )->execute([$claims['sub'], $lessonId, 'in_progress', $now]);
            } elseif ($existing['status'] === 'not_started') {
                $db->prepare('UPDATE lesson_progress SET status = ?, viewed_at = ? WHERE user_id = ? AND lesson_id = ?')
                    ->execute(['in_progress', $now, $claims['sub'], $lessonId]);
            }
        } elseif ($action === 'practice') {
            $practiceCount = $existing ? (int) $existing['practice_count'] + 1 : 1;
            $status = $practiceCount >= 3 ? 'completed' : 'in_progress';
            $completedAt = $practiceCount >= 3 ? $now : ($existing['completed_at'] ?? null);

            if ($existing) {
                $db->prepare(
                    'UPDATE lesson_progress SET practice_count = ?, status = ?, completed_at = ? WHERE user_id = ? AND lesson_id = ?'
                )->execute([$practiceCount, $status, $completedAt, $claims['sub'], $lessonId]);
            } else {
                $db->prepare(
                    'INSERT INTO lesson_progress (user_id, lesson_id, status, viewed_at, practice_count, completed_at) VALUES (?, ?, ?, ?, ?, ?)'
                )->execute([$claims['sub'], $lessonId, $status, $now, $practiceCount, $completedAt]);
            }
        } else {
            Response::error('Invalid action. Use "view" or "practice".', 422);
            return;
        }

        Response::json(['ok' => true]);
    }

    private static function optionalAuth(): ?array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (!preg_match('/^Bearer\s+(.+)$/', $header)) {
            return null;
        }
        try {
            return (array) \Firebase\JWT\JWT::decode(
                trim(substr($header, 7)),
                new \Firebase\JWT\Key($_ENV['JWT_SECRET'], 'HS256')
            );
        } catch (\Exception) {
            return null;
        }
    }
}
