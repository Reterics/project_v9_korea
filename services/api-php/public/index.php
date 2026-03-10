<?php

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use App\Router;
use App\Response;
use App\Middleware\Cors;
use App\Controllers\AuthController;
use App\Controllers\ProfileController;
use App\Controllers\ProgressController;
use App\Controllers\LessonController;
use App\Controllers\ContentController;
use App\Controllers\AdminController;

// Global error handler — always return JSON
set_exception_handler(function (\Throwable $e) {
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
    }

    $isDev = ($_ENV['APP_ENV'] ?? 'production') !== 'production';
    $message = $isDev ? $e->getMessage() : 'Internal server error';

    error_log('[API Error] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());

    Response::error($message, 500, 'INTERNAL_ERROR');
});

set_error_handler(function (int $severity, string $message, string $file, int $line) {
    throw new \ErrorException($message, 0, $severity, $file, $line);
});

// Load environment
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

// Headers
header('Content-Type: application/json; charset=utf-8');
Cors::handle();

// Routes
$router = new Router();

// Auth
$router->post('/api/v1/auth/register', fn() => AuthController::register());
$router->post('/api/v1/auth/login', fn() => AuthController::login());
$router->post('/api/v1/auth/refresh', fn() => AuthController::refresh());
$router->post('/api/v1/auth/logout', fn() => AuthController::logout());
$router->post('/api/v1/auth/change-password', fn() => AuthController::changePassword());
$router->get('/api/v1/auth/me', fn() => AuthController::me());

// Profile
$router->get('/api/v1/profile', fn() => ProfileController::get());
$router->put('/api/v1/profile', fn() => ProfileController::update());

// Progress
$router->get('/api/v1/progress', fn() => ProgressController::getAll());
$router->get('/api/v1/progress/due', fn() => ProgressController::getDue());
$router->get('/api/v1/progress/{kind}/{id}', fn($p) => ProgressController::get($p));
$router->post('/api/v1/progress/game-result', fn() => ProgressController::applyGameResult());

// Lessons
$router->get('/api/v1/lessons', fn() => LessonController::list());
$router->get('/api/v1/lessons/{id}', fn($p) => LessonController::get($p));
$router->post('/api/v1/lessons/{id}/progress', fn($p) => LessonController::updateProgress($p));

// Content
$router->get('/api/v1/content/words', fn() => ContentController::listWords());
$router->get('/api/v1/content/words/{id}', fn($p) => ContentController::getWord($p));

// Admin
$router->get('/api/v1/admin/users', fn() => AdminController::listUsers());
$router->get('/api/v1/admin/users/{id}/stats', fn($p) => AdminController::getUserStats($p));
$router->put('/api/v1/admin/users/{id}/role', fn($p) => AdminController::updateUserRole($p));

// Dispatch
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
