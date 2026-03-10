<?php

namespace App;

class Response
{
    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    public static function error(string $message, int $status = 400, ?string $code = null): void
    {
        $payload = ['error' => $message];
        if ($code !== null) {
            $payload['code'] = $code;
        }
        self::json($payload, $status);
    }

    public static function body(): array
    {
        $raw = file_get_contents('php://input');
        return json_decode($raw, true) ?? [];
    }
}
