<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Response;

class HealthController
{
    public function index(): void
    {
        Response::json([
            'status'    => 'ok',
            'timestamp' => date('c'),
            'app'       => 'Spanish Learning API',
            'version'   => '0.1.0',
        ]);
    }
}
