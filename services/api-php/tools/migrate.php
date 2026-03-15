<?php
/**
 * Database migration tool.
 * Usage: php tools/migrate.php [--dry-run]
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Database;

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$dryRun = in_array('--dry-run', $argv);

$migrationsDir = __DIR__ . '/../migrations';
$files = glob($migrationsDir . '/*.sql');
sort($files);

if (empty($files)) {
    echo "No migration files found.\n";
    exit(0);
}

$db = Database::connection();

// Create migrations tracking table
$db->exec('CREATE TABLE IF NOT EXISTS _migrations (
    filename VARCHAR(255) PRIMARY KEY,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)');

$applied = $db->query('SELECT filename FROM _migrations')->fetchAll(PDO::FETCH_COLUMN);

foreach ($files as $file) {
    $filename = basename($file);

    if (in_array($filename, $applied)) {
        echo "[skip] $filename (already applied)\n";
        continue;
    }

    $sql = file_get_contents($file);

    if ($dryRun) {
        echo "[dry-run] Would apply: $filename\n";
        continue;
    }

    echo "[apply] $filename ... ";

    try {
        // Split on semicolons, strip leading comment lines, filter empty statements
        $statements = array_filter(
            array_map(function ($s) {
                // Remove leading -- comment lines before the actual SQL
                $s = preg_replace('/^(\s*--[^\n]*\n)+/m', '', $s);
                return trim($s);
            }, explode(';', $sql)),
            fn($s) => $s !== ''
        );

        foreach ($statements as $stmt) {
            $db->exec($stmt);
        }

        $db->prepare('INSERT INTO _migrations (filename) VALUES (?)')->execute([$filename]);
        echo "OK\n";
    } catch (PDOException $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
        exit(1);
    }
}

echo "\nMigration complete.\n";
