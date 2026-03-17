<?php

namespace App\Controllers;

use App\Database;
use App\Middleware\Auth;
use App\Response;

class ContentAdminController
{
    // =====================================================================
    // WORDS
    // =====================================================================

    public static function listWords(): void
    {
        Auth::requireAdmin();
        $db = Database::connection();
        $stmt = $db->query('SELECT * FROM words ORDER BY level, id');
        Response::json($stmt->fetchAll());
    }

    public static function createWord(): void
    {
        Auth::requireAdmin();
        $body = Response::body();

        foreach (['id', 'korean', 'romanization', 'english', 'category', 'level'] as $field) {
            if (empty($body[$field])) {
                Response::error("Field '$field' is required", 422);
                return;
            }
        }

        $db = Database::connection();

        $dup = $db->prepare('SELECT id FROM words WHERE id = ?');
        $dup->execute([$body['id']]);
        if ($dup->fetch()) {
            Response::error("A word with id '{$body['id']}' already exists", 409, 'DUPLICATE_ID');
            return;
        }

        $db->prepare(
            'INSERT INTO words (id, korean, romanization, english, category, level, example) VALUES (?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            $body['id'],
            $body['korean'],
            $body['romanization'],
            $body['english'],
            $body['category'],
            $body['level'],
            $body['example'] ?? null,
        ]);

        Response::json(['id' => $body['id']], 201);
    }

    public static function updateWord(array $params): void
    {
        Auth::requireAdmin();
        $body = Response::body();
        $db = Database::connection();

        foreach (['korean', 'romanization', 'english', 'category', 'level'] as $field) {
            if (empty($body[$field])) {
                Response::error("Field '$field' is required", 422);
                return;
            }
        }

        $check = $db->prepare('SELECT id FROM words WHERE id = ?');
        $check->execute([$params['id']]);
        if (!$check->fetch()) {
            Response::error('Word not found', 404);
            return;
        }

        $db->prepare(
            'UPDATE words SET korean=?, romanization=?, english=?, category=?, level=?, example=? WHERE id=?'
        )->execute([
            $body['korean'],
            $body['romanization'],
            $body['english'],
            $body['category'],
            $body['level'],
            $body['example'] ?? null,
            $params['id'],
        ]);

        Response::json(['ok' => true]);
    }

    public static function deleteWord(array $params): void
    {
        Auth::requireAdmin();
        $db = Database::connection();

        $check = $db->prepare('SELECT id FROM words WHERE id = ?');
        $check->execute([$params['id']]);
        if (!$check->fetch()) {
            Response::error('Word not found', 404);
            return;
        }

        $db->prepare('DELETE FROM words WHERE id = ?')->execute([$params['id']]);
        Response::json(['ok' => true]);
    }

    // =====================================================================
    // SENTENCES
    // =====================================================================

    public static function listSentences(): void
    {
        Auth::requireAdmin();
        $db = Database::connection();
        $stmt = $db->query('SELECT * FROM sentences ORDER BY level, id');

        $rows = [];
        foreach ($stmt->fetchAll() as $row) {
            $rows[] = [
                'id'      => $row['id'],
                'tokens'  => json_decode($row['tokens'], true),
                'roles'   => json_decode($row['roles'], true),
                'english' => $row['english'],
                'hint'    => $row['hint'],
                'level'   => $row['level'],
            ];
        }

        Response::json($rows);
    }

    public static function createSentence(): void
    {
        Auth::requireAdmin();
        $body = Response::body();

        foreach (['id', 'tokens', 'roles', 'english', 'level'] as $field) {
            if (!isset($body[$field]) || ($body[$field] === '' || $body[$field] === [])) {
                Response::error("Field '$field' is required", 422);
                return;
            }
        }

        $tokens = $body['tokens'];
        $roles  = $body['roles'];

        if (!is_array($tokens) || !is_array($roles) || count($tokens) !== count($roles)) {
            Response::error('tokens and roles must be arrays of equal length', 422);
            return;
        }

        $db = Database::connection();

        $dup = $db->prepare('SELECT id FROM sentences WHERE id = ?');
        $dup->execute([$body['id']]);
        if ($dup->fetch()) {
            Response::error("A sentence with id '{$body['id']}' already exists", 409, 'DUPLICATE_ID');
            return;
        }

        $db->prepare(
            'INSERT INTO sentences (id, tokens, roles, english, hint, level) VALUES (?, ?, ?, ?, ?, ?)'
        )->execute([
            $body['id'],
            json_encode($tokens, JSON_UNESCAPED_UNICODE),
            json_encode($roles, JSON_UNESCAPED_UNICODE),
            $body['english'],
            $body['hint'] ?? null,
            $body['level'],
        ]);

        Response::json(['id' => $body['id']], 201);
    }

    public static function updateSentence(array $params): void
    {
        Auth::requireAdmin();
        $body = Response::body();
        $db   = Database::connection();

        foreach (['tokens', 'roles', 'english', 'level'] as $field) {
            if (!isset($body[$field]) || ($body[$field] === '' || $body[$field] === [])) {
                Response::error("Field '$field' is required", 422);
                return;
            }
        }

        $tokens = $body['tokens'];
        $roles  = $body['roles'];

        if (!is_array($tokens) || !is_array($roles) || count($tokens) !== count($roles)) {
            Response::error('tokens and roles must be arrays of equal length', 422);
            return;
        }

        $check = $db->prepare('SELECT id FROM sentences WHERE id = ?');
        $check->execute([$params['id']]);
        if (!$check->fetch()) {
            Response::error('Sentence not found', 404);
            return;
        }

        $db->prepare(
            'UPDATE sentences SET tokens=?, roles=?, english=?, hint=?, level=? WHERE id=?'
        )->execute([
            json_encode($tokens, JSON_UNESCAPED_UNICODE),
            json_encode($roles, JSON_UNESCAPED_UNICODE),
            $body['english'],
            $body['hint'] ?? null,
            $body['level'],
            $params['id'],
        ]);

        Response::json(['ok' => true]);
    }

    public static function deleteSentence(array $params): void
    {
        Auth::requireAdmin();
        $db = Database::connection();

        $check = $db->prepare('SELECT id FROM sentences WHERE id = ?');
        $check->execute([$params['id']]);
        if (!$check->fetch()) {
            Response::error('Sentence not found', 404);
            return;
        }

        $db->prepare('DELETE FROM sentences WHERE id = ?')->execute([$params['id']]);
        Response::json(['ok' => true]);
    }

    // =====================================================================
    // LESSONS
    // =====================================================================

    private static function formatLesson(array $lesson, array $examples, array $blocks): array
    {
        return [
            'id'                 => $lesson['id'],
            'slug'               => $lesson['slug'],
            'title'              => $lesson['title'],
            'category'           => $lesson['category'],
            'level'              => $lesson['level'],
            'summary'            => $lesson['summary'],
            'pattern'            => $lesson['pattern_data']
                ? json_decode($lesson['pattern_data'], true)
                : null,
            'examples'           => $examples,
            'explanationBlocks'  => $blocks,
            'relatedSentenceIds' => $lesson['related_sentence_ids']
                ? json_decode($lesson['related_sentence_ids'], true)
                : [],
            'practiceModes'      => $lesson['practice_modes']
                ? json_decode($lesson['practice_modes'], true)
                : [],
            'nextLessonId'       => $lesson['next_lesson_id'],
            'sortOrder'          => (int) $lesson['sort_order'],
        ];
    }

    public static function listLessons(): void
    {
        Auth::requireAdmin();
        $db = Database::connection();

        $lessonStmt = $db->query('SELECT * FROM lessons ORDER BY sort_order, id');
        $lessons    = $lessonStmt->fetchAll();

        if (empty($lessons)) {
            Response::json([]);
            return;
        }

        $ids          = array_map(fn($l) => $l['id'], $lessons);
        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        $exStmt = $db->prepare(
            "SELECT * FROM lesson_examples WHERE lesson_id IN ($placeholders) ORDER BY lesson_id, sort_order"
        );
        $exStmt->execute($ids);

        $blStmt = $db->prepare(
            "SELECT * FROM lesson_explanation_blocks WHERE lesson_id IN ($placeholders) ORDER BY lesson_id, sort_order"
        );
        $blStmt->execute($ids);

        $exByLesson = [];
        foreach ($exStmt->fetchAll() as $ex) {
            $exByLesson[$ex['lesson_id']][] = [
                'id'               => $ex['id'],
                'english'          => $ex['english'],
                'korean'           => $ex['korean'],
                'englishBreakdown' => json_decode($ex['english_breakdown'], true),
                'koreanBreakdown'  => json_decode($ex['korean_breakdown'], true),
                'notes'            => $ex['notes'] ? json_decode($ex['notes'], true) : [],
            ];
        }

        $blByLesson = [];
        foreach ($blStmt->fetchAll() as $bl) {
            $blByLesson[$bl['lesson_id']][] = [
                'id'      => $bl['id'],
                'type'    => $bl['type'],
                'title'   => $bl['title'],
                'content' => $bl['content'],
            ];
        }

        $result = [];
        foreach ($lessons as $lesson) {
            $result[] = self::formatLesson(
                $lesson,
                $exByLesson[$lesson['id']] ?? [],
                $blByLesson[$lesson['id']] ?? []
            );
        }

        Response::json($result);
    }

    public static function createLesson(): void
    {
        Auth::requireAdmin();
        $body = Response::body();

        foreach (['id', 'slug', 'title', 'category', 'level', 'summary'] as $field) {
            if (empty($body[$field])) {
                Response::error("Field '$field' is required", 422);
                return;
            }
        }

        $db = Database::connection();

        $dup = $db->prepare('SELECT id FROM lessons WHERE id = ?');
        $dup->execute([$body['id']]);
        if ($dup->fetch()) {
            Response::error("A lesson with id '{$body['id']}' already exists", 409, 'DUPLICATE_ID');
            return;
        }

        $db->beginTransaction();

        try {
            $db->prepare(
                'INSERT INTO lessons (id, slug, title, category, level, summary, pattern_data, related_sentence_ids, practice_modes, next_lesson_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            )->execute([
                $body['id'],
                $body['slug'],
                $body['title'],
                $body['category'],
                $body['level'],
                $body['summary'],
                isset($body['pattern']) ? json_encode($body['pattern'], JSON_UNESCAPED_UNICODE) : null,
                json_encode($body['relatedSentenceIds'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($body['practiceModes'] ?? [], JSON_UNESCAPED_UNICODE),
                $body['nextLessonId'] ?? null,
                $body['sortOrder'] ?? 0,
            ]);

            $exStmt = $db->prepare(
                'INSERT INTO lesson_examples (id, lesson_id, english, korean, english_breakdown, korean_breakdown, notes, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach (($body['examples'] ?? []) as $i => $ex) {
                $exStmt->execute([
                    $ex['id'],
                    $body['id'],
                    $ex['english'],
                    $ex['korean'],
                    json_encode($ex['englishBreakdown'] ?? [], JSON_UNESCAPED_UNICODE),
                    json_encode($ex['koreanBreakdown'] ?? [], JSON_UNESCAPED_UNICODE),
                    json_encode($ex['notes'] ?? [], JSON_UNESCAPED_UNICODE),
                    $i,
                ]);
            }

            $blStmt = $db->prepare(
                'INSERT INTO lesson_explanation_blocks (id, lesson_id, type, title, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
            );
            foreach (($body['explanationBlocks'] ?? []) as $i => $bl) {
                $blStmt->execute([
                    $bl['id'],
                    $body['id'],
                    $bl['type'] ?? 'text',
                    $bl['title'] ?? null,
                    $bl['content'],
                    $i,
                ]);
            }

            $db->commit();
            Response::json(['id' => $body['id']], 201);
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function updateLesson(array $params): void
    {
        Auth::requireAdmin();
        $body = Response::body();
        $db   = Database::connection();

        foreach (['slug', 'title', 'category', 'level', 'summary'] as $field) {
            if (empty($body[$field])) {
                Response::error("Field '$field' is required", 422);
                return;
            }
        }

        $check = $db->prepare('SELECT id FROM lessons WHERE id = ?');
        $check->execute([$params['id']]);
        if (!$check->fetch()) {
            Response::error('Lesson not found', 404);
            return;
        }

        $db->beginTransaction();

        try {
            $db->prepare(
                'UPDATE lessons SET slug=?, title=?, category=?, level=?, summary=?, pattern_data=?, related_sentence_ids=?, practice_modes=?, next_lesson_id=?, sort_order=? WHERE id=?'
            )->execute([
                $body['slug'],
                $body['title'],
                $body['category'],
                $body['level'],
                $body['summary'],
                isset($body['pattern']) ? json_encode($body['pattern'], JSON_UNESCAPED_UNICODE) : null,
                json_encode($body['relatedSentenceIds'] ?? [], JSON_UNESCAPED_UNICODE),
                json_encode($body['practiceModes'] ?? [], JSON_UNESCAPED_UNICODE),
                $body['nextLessonId'] ?? null,
                $body['sortOrder'] ?? 0,
                $params['id'],
            ]);

            $db->prepare('DELETE FROM lesson_examples WHERE lesson_id = ?')->execute([$params['id']]);
            $exStmt = $db->prepare(
                'INSERT INTO lesson_examples (id, lesson_id, english, korean, english_breakdown, korean_breakdown, notes, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            foreach (($body['examples'] ?? []) as $i => $ex) {
                $exStmt->execute([
                    $ex['id'],
                    $params['id'],
                    $ex['english'],
                    $ex['korean'],
                    json_encode($ex['englishBreakdown'] ?? [], JSON_UNESCAPED_UNICODE),
                    json_encode($ex['koreanBreakdown'] ?? [], JSON_UNESCAPED_UNICODE),
                    json_encode($ex['notes'] ?? [], JSON_UNESCAPED_UNICODE),
                    $i,
                ]);
            }

            $db->prepare('DELETE FROM lesson_explanation_blocks WHERE lesson_id = ?')->execute([$params['id']]);
            $blStmt = $db->prepare(
                'INSERT INTO lesson_explanation_blocks (id, lesson_id, type, title, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
            );
            foreach (($body['explanationBlocks'] ?? []) as $i => $bl) {
                $blStmt->execute([
                    $bl['id'],
                    $params['id'],
                    $bl['type'] ?? 'text',
                    $bl['title'] ?? null,
                    $bl['content'],
                    $i,
                ]);
            }

            $db->commit();
            Response::json(['ok' => true]);
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    public static function deleteLesson(array $params): void
    {
        Auth::requireAdmin();
        $db = Database::connection();

        $check = $db->prepare('SELECT id FROM lessons WHERE id = ?');
        $check->execute([$params['id']]);
        if (!$check->fetch()) {
            Response::error('Lesson not found', 404);
            return;
        }

        // ON DELETE CASCADE handles lesson_examples and lesson_explanation_blocks
        $db->prepare('DELETE FROM lessons WHERE id = ?')->execute([$params['id']]);
        Response::json(['ok' => true]);
    }

    // =====================================================================
    // GAME CONFIGS
    // =====================================================================

    public static function listGameConfigs(): void
    {
        Auth::requireAdmin();
        Response::json(self::fetchGameConfigs());
    }

    public static function updateGameConfig(array $params): void
    {
        Auth::requireAdmin();
        $body = Response::body();
        $db   = Database::connection();

        $difficulty = $body['difficulty'] ?? 'normal';
        if (!in_array($difficulty, ['easy', 'normal', 'hard'], true)) {
            Response::error("difficulty must be 'easy', 'normal', or 'hard'", 422);
            return;
        }

        $check = $db->prepare('SELECT game_id FROM game_configs WHERE game_id = ?');
        $check->execute([$params['gameId']]);
        if (!$check->fetch()) {
            Response::error('Game config not found', 404);
            return;
        }

        $db->prepare(
            'UPDATE game_configs SET total_questions=?, time_limit_sec=?, difficulty=?, engine_config=? WHERE game_id=?'
        )->execute([
            (int) ($body['totalQuestions'] ?? 10),
            isset($body['timeLimitSec']) && $body['timeLimitSec'] !== null
                ? (int) $body['timeLimitSec']
                : null,
            $difficulty,
            isset($body['engineConfig'])
                ? json_encode($body['engineConfig'], JSON_UNESCAPED_UNICODE)
                : null,
            $params['gameId'],
        ]);

        Response::json(['ok' => true]);
    }

    // Public – no admin guard
    public static function getPublicGameConfigs(): void
    {
        Response::json(self::fetchGameConfigs());
    }

    // =====================================================================
    // SEED DEMO DATA
    // =====================================================================

    public static function seedDemoData(): void
    {
        Auth::requireAdmin();
        $body = Response::body();

        $mode = $body['mode'] ?? 'skip';
        if (!in_array($mode, ['skip', 'overwrite'], true)) {
            Response::error("mode must be 'skip' or 'overwrite'", 422);
            return;
        }

        $words     = $body['words']     ?? [];
        $sentences = $body['sentences'] ?? [];
        $lessons   = $body['lessons']   ?? [];

        $db     = Database::connection();
        $counts = ['words' => 0, 'sentences' => 0, 'lessons' => 0];

        $db->beginTransaction();
        try {
            // --- Words ---
            if (!empty($words)) {
                if ($mode === 'overwrite') {
                    $ids  = array_column($words, 'id');
                    $ph   = implode(',', array_fill(0, count($ids), '?'));
                    $db->prepare("DELETE FROM words WHERE id IN ($ph)")->execute($ids);
                }
                $wStmt = $db->prepare(
                    'INSERT' . ($mode === 'skip' ? ' IGNORE' : '') .
                    ' INTO words (id, korean, romanization, english, category, level, example) VALUES (?, ?, ?, ?, ?, ?, ?)'
                );
                foreach ($words as $w) {
                    $wStmt->execute([
                        $w['id'], $w['korean'], $w['romanization'], $w['english'],
                        $w['category'], $w['level'], $w['example'] ?? null,
                    ]);
                    $counts['words'] += $wStmt->rowCount();
                }
            }

            // --- Sentences ---
            if (!empty($sentences)) {
                if ($mode === 'overwrite') {
                    $ids = array_column($sentences, 'id');
                    $ph  = implode(',', array_fill(0, count($ids), '?'));
                    $db->prepare("DELETE FROM sentences WHERE id IN ($ph)")->execute($ids);
                }
                $sStmt = $db->prepare(
                    'INSERT' . ($mode === 'skip' ? ' IGNORE' : '') .
                    ' INTO sentences (id, tokens, roles, english, hint, level) VALUES (?, ?, ?, ?, ?, ?)'
                );
                foreach ($sentences as $s) {
                    $sStmt->execute([
                        $s['id'],
                        json_encode($s['tokens'], JSON_UNESCAPED_UNICODE),
                        json_encode($s['roles'],  JSON_UNESCAPED_UNICODE),
                        $s['english'],
                        $s['hint'] ?? null,
                        $s['level'],
                    ]);
                    $counts['sentences'] += $sStmt->rowCount();
                }
            }

            // --- Lessons ---
            if (!empty($lessons)) {
                foreach ($lessons as $i => $lesson) {
                    if ($mode === 'overwrite') {
                        // CASCADE deletes examples and blocks
                        $db->prepare('DELETE FROM lessons WHERE id = ?')->execute([$lesson['id']]);
                    }

                    $lStmt = $db->prepare(
                        'INSERT' . ($mode === 'skip' ? ' IGNORE' : '') .
                        ' INTO lessons (id, slug, title, category, level, summary, pattern_data, related_sentence_ids, practice_modes, next_lesson_id, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                    );
                    $lStmt->execute([
                        $lesson['id'],
                        $lesson['slug'],
                        $lesson['title'],
                        $lesson['category'],
                        $lesson['level'],
                        $lesson['summary'],
                        isset($lesson['pattern'])
                            ? json_encode($lesson['pattern'], JSON_UNESCAPED_UNICODE)
                            : null,
                        json_encode($lesson['relatedSentenceIds'] ?? [], JSON_UNESCAPED_UNICODE),
                        json_encode($lesson['practiceModes']      ?? [], JSON_UNESCAPED_UNICODE),
                        $lesson['nextLessonId'] ?? null,
                        $lesson['sortOrder'] ?? $i,
                    ]);
                    $counts['lessons'] += $lStmt->rowCount();

                    // Insert child records only when the lesson row was written
                    $lessonWasInserted = $lStmt->rowCount() > 0;
                    if ($lessonWasInserted) {
                        $exStmt = $db->prepare(
                            'INSERT IGNORE INTO lesson_examples (id, lesson_id, english, korean, english_breakdown, korean_breakdown, notes, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                        );
                        foreach (($lesson['examples'] ?? []) as $j => $ex) {
                            $exStmt->execute([
                                $ex['id'],
                                $lesson['id'],
                                $ex['english'],
                                $ex['korean'],
                                json_encode($ex['englishBreakdown'] ?? [], JSON_UNESCAPED_UNICODE),
                                json_encode($ex['koreanBreakdown']  ?? [], JSON_UNESCAPED_UNICODE),
                                json_encode($ex['notes']            ?? [], JSON_UNESCAPED_UNICODE),
                                $j,
                            ]);
                        }

                        $blStmt = $db->prepare(
                            'INSERT IGNORE INTO lesson_explanation_blocks (id, lesson_id, type, title, content, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
                        );
                        foreach (($lesson['explanationBlocks'] ?? []) as $j => $bl) {
                            $blStmt->execute([
                                $bl['id'],
                                $lesson['id'],
                                $bl['type']  ?? 'text',
                                $bl['title'] ?? null,
                                $bl['content'],
                                $j,
                            ]);
                        }
                    }
                }
            }

            $db->commit();
            Response::json(['seeded' => $counts]);
        } catch (\Exception $e) {
            $db->rollBack();
            throw $e;
        }
    }

    private static function fetchGameConfigs(): array
    {
        $db   = Database::connection();
        $stmt = $db->query('SELECT * FROM game_configs ORDER BY game_id');

        $result = [];
        foreach ($stmt->fetchAll() as $row) {
            $result[] = [
                'gameId'         => $row['game_id'],
                'totalQuestions' => (int) $row['total_questions'],
                'timeLimitSec'   => $row['time_limit_sec'] !== null ? (int) $row['time_limit_sec'] : null,
                'difficulty'     => $row['difficulty'],
                'engineConfig'   => $row['engine_config']
                    ? json_decode($row['engine_config'], true)
                    : null,
            ];
        }

        return $result;
    }
}
