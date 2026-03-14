<?php

namespace App\Controllers;

use App\Database;
use App\Response;

class ContentController
{
    public static function listWords(): void
    {
        $db = Database::connection();
        $level = $_GET['level'] ?? null;

        if ($level) {
            $stmt = $db->prepare('SELECT * FROM words WHERE level = ? ORDER BY id');
            $stmt->execute([$level]);
        } else {
            $stmt = $db->query('SELECT * FROM words ORDER BY level, id');
        }

        $words = [];
        foreach ($stmt->fetchAll() as $row) {
            $words[] = [
                'id' => $row['id'],
                'korean' => $row['korean'],
                'romanization' => $row['romanization'],
                'english' => $row['english'],
                'category' => $row['category'],
                'level' => $row['level'],
                'example' => $row['example'],
            ];
        }

        Response::json($words);
    }

    public static function getWord(array $params): void
    {
        $db = Database::connection();
        $stmt = $db->prepare('SELECT * FROM words WHERE id = ?');
        $stmt->execute([$params['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            Response::error('Word not found', 404);
            return;
        }

        Response::json([
            'id' => $row['id'],
            'korean' => $row['korean'],
            'romanization' => $row['romanization'],
            'english' => $row['english'],
            'category' => $row['category'],
            'level' => $row['level'],
            'example' => $row['example'],
        ]);
    }

    public static function listSentences(): void
    {
        $db = Database::connection();
        $level = $_GET['level'] ?? null;

        if ($level) {
            $stmt = $db->prepare('SELECT * FROM sentences WHERE level = ? ORDER BY id');
            $stmt->execute([$level]);
        } else {
            $stmt = $db->query('SELECT * FROM sentences ORDER BY level, id');
        }

        $sentences = [];
        foreach ($stmt->fetchAll() as $row) {
            $sentences[] = [
                'id' => $row['id'],
                'tokens' => json_decode($row['tokens'], true),
                'roles' => json_decode($row['roles'], true),
                'english' => $row['english'],
                'hint' => $row['hint'],
                'level' => $row['level'],
            ];
        }

        Response::json($sentences);
    }
}
