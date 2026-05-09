<?php

declare(strict_types=1);

namespace App;

class Router
{
    private array $routes = [];

    public function get(string $path, array $handler): void
    {
        $this->routes['GET'][$path] = $handler;
    }

    public function post(string $path, array $handler): void
    {
        $this->routes['POST'][$path] = $handler;
    }

    public function dispatch(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

        // Strip /api prefix so routes are defined without it
        $path = preg_replace('#^/api#', '', $uri) ?: '/';

        $handler = $this->routes[$method][$path] ?? null;

        if ($handler !== null) {
            [$class, $action] = $handler;
            (new $class())->$action();
            return;
        }

        Response::json(['error' => 'Route not found'], 404);
    }
}
