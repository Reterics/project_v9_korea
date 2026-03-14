<?php
/**
 * Content import tool.
 * Imports JSON content files from the frontend repository into the database.
 *
 * Usage: php tools/import-content.php [--dry-run] [--verbose]
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$dryRun = in_array('--dry-run', $argv);
$verbose = in_array('--verbose', $argv);

$contentDir = realpath(__DIR__ . '/../../apps/web/src/features/learn/content/data');

if (!$contentDir || !is_dir($contentDir)) {
    // Try alternative relative path
    $contentDir = realpath(__DIR__ . '/../../../apps/web/src/features/learn/content/data');
}

if (!$contentDir || !is_dir($contentDir)) {
    echo "ERROR: Content directory not found. Expected at apps/web/src/features/learn/content/data/\n";
    exit(1);
}

echo "Content directory: $contentDir\n";
echo $dryRun ? "Mode: DRY RUN\n\n" : "Mode: LIVE\n\n";

$db = $dryRun ? null : Database::connection();

// --- Import Words ---
$wordFiles = glob($contentDir . '/*-words.json');
$totalWords = 0;
$newWords = 0;
$updatedWords = 0;

foreach ($wordFiles as $file) {
    $filename = basename($file);
    echo "Processing $filename...\n";

    $data = json_decode(file_get_contents($file), true);
    if (!is_array($data)) {
        echo "  WARNING: Invalid JSON in $filename\n";
        continue;
    }

    foreach ($data as $word) {
        $totalWords++;

        // Validate required fields
        $required = ['id', 'korean', 'romanization', 'english', 'category', 'level'];
        $missing = array_filter($required, fn($f) => empty($word[$f]));
        if (!empty($missing)) {
            echo "  WARNING: Word missing fields [" . implode(', ', $missing) . "]: " . json_encode($word) . "\n";
            continue;
        }

        if ($verbose) {
            echo "  Word: {$word['id']} - {$word['korean']} ({$word['english']})\n";
        }

        if (!$dryRun) {
            $stmt = $db->prepare('SELECT id FROM words WHERE id = ?');
            $stmt->execute([$word['id']]);
            $exists = $stmt->fetch();

            if ($exists) {
                $db->prepare(
                    'UPDATE words SET korean = ?, romanization = ?, english = ?, category = ?, level = ?, example = ? WHERE id = ?'
                )->execute([
                    $word['korean'], $word['romanization'], $word['english'],
                    $word['category'], $word['level'], $word['example'] ?? null, $word['id'],
                ]);
                $updatedWords++;
            } else {
                $db->prepare(
                    'INSERT INTO words (id, korean, romanization, english, category, level, example) VALUES (?, ?, ?, ?, ?, ?, ?)'
                )->execute([
                    $word['id'], $word['korean'], $word['romanization'], $word['english'],
                    $word['category'], $word['level'], $word['example'] ?? null,
                ]);
                $newWords++;
            }
        }
    }
}

echo "\nWords: $totalWords total";
if (!$dryRun) echo " ($newWords new, $updatedWords updated)";
echo "\n";

// --- Import Grammar Lessons ---
$lessonFiles = glob($contentDir . '/*-grammar-lessons.json');
$totalLessons = 0;
$newLessons = 0;
$updatedLessons = 0;

foreach ($lessonFiles as $file) {
    $filename = basename($file);
    echo "\nProcessing $filename...\n";

    $data = json_decode(file_get_contents($file), true);
    if (!is_array($data)) {
        echo "  WARNING: Invalid JSON in $filename\n";
        continue;
    }

    foreach ($data as $sortOrder => $lesson) {
        $totalLessons++;

        $required = ['id', 'slug', 'title', 'category', 'level', 'summary'];
        $missing = array_filter($required, fn($f) => empty($lesson[$f]));
        if (!empty($missing)) {
            echo "  WARNING: Lesson missing fields [" . implode(', ', $missing) . "]: {$lesson['id']}\n";
            continue;
        }

        if ($verbose) {
            echo "  Lesson: {$lesson['id']} - {$lesson['title']}\n";
        }

        if (!$dryRun) {
            $stmt = $db->prepare('SELECT id FROM lessons WHERE id = ?');
            $stmt->execute([$lesson['id']]);
            $exists = $stmt->fetch();

            $patternData = isset($lesson['pattern']) ? json_encode($lesson['pattern']) : null;
            $relatedIds = json_encode($lesson['relatedSentenceIds'] ?? []);
            $practiceModes = json_encode($lesson['practiceModes'] ?? []);

            if ($exists) {
                $db->prepare(
                    'UPDATE lessons SET slug = ?, title = ?, category = ?, level = ?, summary = ?,
                     pattern_data = ?, related_sentence_ids = ?, practice_modes = ?,
                     next_lesson_id = ?, sort_order = ? WHERE id = ?'
                )->execute([
                    $lesson['slug'], $lesson['title'], $lesson['category'], $lesson['level'],
                    $lesson['summary'], $patternData, $relatedIds, $practiceModes,
                    $lesson['nextLessonId'] ?? null, $sortOrder, $lesson['id'],
                ]);
                $updatedLessons++;

                // Delete existing examples and blocks for re-insert
                $db->prepare('DELETE FROM lesson_examples WHERE lesson_id = ?')->execute([$lesson['id']]);
                $db->prepare('DELETE FROM lesson_explanation_blocks WHERE lesson_id = ?')->execute([$lesson['id']]);
            } else {
                $db->prepare(
                    'INSERT INTO lessons (id, slug, title, category, level, summary, pattern_data,
                     related_sentence_ids, practice_modes, next_lesson_id, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                )->execute([
                    $lesson['id'], $lesson['slug'], $lesson['title'], $lesson['category'],
                    $lesson['level'], $lesson['summary'], $patternData, $relatedIds,
                    $practiceModes, $lesson['nextLessonId'] ?? null, $sortOrder,
                ]);
                $newLessons++;
            }

            // Insert examples
            foreach (($lesson['examples'] ?? []) as $exOrder => $example) {
                $db->prepare(
                    'INSERT INTO lesson_examples (id, lesson_id, english, korean, english_breakdown, korean_breakdown, notes, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                )->execute([
                    $example['id'], $lesson['id'], $example['english'], $example['korean'],
                    json_encode($example['englishBreakdown'] ?? []),
                    json_encode($example['koreanBreakdown'] ?? []),
                    isset($example['notes']) ? json_encode($example['notes']) : null,
                    $exOrder,
                ]);
            }

            // Insert explanation blocks
            foreach (($lesson['explanationBlocks'] ?? []) as $blOrder => $block) {
                $db->prepare(
                    'INSERT INTO lesson_explanation_blocks (id, lesson_id, type, title, content, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?)'
                )->execute([
                    $block['id'], $lesson['id'], $block['type'],
                    $block['title'] ?? null, $block['content'], $blOrder,
                ]);
            }
        }
    }
}

echo "\nLessons: $totalLessons total";
if (!$dryRun) echo " ($newLessons new, $updatedLessons updated)";
echo "\n";

// --- Import Sentences ---
$sentenceFiles = glob($contentDir . '/*-sentences.json');
$totalSentences = 0;
$newSentences = 0;
$updatedSentences = 0;

foreach ($sentenceFiles as $file) {
    $filename = basename($file);
    echo "\nProcessing $filename...\n";

    $data = json_decode(file_get_contents($file), true);
    if (!is_array($data)) {
        echo "  WARNING: Invalid JSON in $filename\n";
        continue;
    }

    foreach ($data as $sentence) {
        $totalSentences++;

        $required = ['id', 'tokens', 'english', 'level'];
        $missing = array_filter($required, fn($f) => empty($sentence[$f]));
        if (!empty($missing)) {
            echo "  WARNING: Sentence missing fields [" . implode(', ', $missing) . "]: " . json_encode($sentence) . "\n";
            continue;
        }

        if ($verbose) {
            echo "  Sentence: {$sentence['id']} - {$sentence['english']}\n";
        }

        if (!$dryRun) {
            $stmt = $db->prepare('SELECT id FROM sentences WHERE id = ?');
            $stmt->execute([$sentence['id']]);
            $exists = $stmt->fetch();

            $tokens = json_encode($sentence['tokens']);
            $roles = json_encode($sentence['roles'] ?? []);

            if ($exists) {
                $db->prepare(
                    'UPDATE sentences SET tokens = ?, roles = ?, english = ?, hint = ?, level = ? WHERE id = ?'
                )->execute([
                    $tokens, $roles, $sentence['english'],
                    $sentence['hint'] ?? null, $sentence['level'], $sentence['id'],
                ]);
                $updatedSentences++;
            } else {
                $db->prepare(
                    'INSERT INTO sentences (id, tokens, roles, english, hint, level) VALUES (?, ?, ?, ?, ?, ?)'
                )->execute([
                    $sentence['id'], $tokens, $roles, $sentence['english'],
                    $sentence['hint'] ?? null, $sentence['level'],
                ]);
                $newSentences++;
            }
        }
    }
}

echo "\nSentences: $totalSentences total";
if (!$dryRun) echo " ($newSentences new, $updatedSentences updated)";
echo "\n";

echo "\nImport complete.\n";
