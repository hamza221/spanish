<?php

declare(strict_types=1);

// CORS headers — tighten origin in production
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../src/Response.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/../src/Controllers/HealthController.php';
require_once __DIR__ . '/../src/Controllers/ModuleController.php';

use App\Router;
use App\Controllers\HealthController;
use App\Controllers\ModuleController;

$router = new Router();

$router->get('/health',  [HealthController::class,  'index']);
$router->get('/modules', [ModuleController::class,   'index']);

$router->dispatch();
