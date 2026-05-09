<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Response;

/**
 * Returns the list of app modules and their current status.
 * This mirrors the frontend registry so the API can be consumed by
 * external clients or a future mobile app.
 */
class ModuleController
{
    private const MODULES = [
        [
            'id'          => 'flashcards',
            'name'        => 'Flashcard Vocabulary',
            'description' => 'Frequency-prioritized vocab with spaced repetition.',
            'status'      => 'coming-soon',
            'phase'       => 1,
            'tags'        => ['Vocabulary', 'Spaced Repetition', 'CEFR'],
        ],
        [
            'id'          => 'writing-coach',
            'name'        => 'Writing Coach',
            'description' => 'Write freely in Spanish and get inline AI corrections.',
            'status'      => 'coming-soon',
            'phase'       => 2,
            'tags'        => ['Writing', 'Grammar', 'AI'],
        ],
        [
            'id'          => 'news-reader',
            'name'        => 'Graded News Reader',
            'description' => 'Real Spanish news rewritten at your level.',
            'status'      => 'coming-soon',
            'phase'       => 3,
            'tags'        => ['Reading', 'News', 'Comprehension'],
        ],
        [
            'id'          => 'content-builder',
            'name'        => 'Content Vocab Builder',
            'description' => 'Learn vocabulary from YouTube videos or articles you care about.',
            'status'      => 'coming-soon',
            'phase'       => 4,
            'tags'        => ['YouTube', 'Custom Content', 'Vocabulary'],
        ],
        [
            'id'          => 'conversation',
            'name'        => 'Conversation Partner',
            'description' => 'Chat with AI personas in real-world Spanish scenarios.',
            'status'      => 'coming-soon',
            'phase'       => 5,
            'tags'        => ['Speaking', 'Roleplay', 'AI'],
        ],
    ];

    public function index(): void
    {
        Response::json([
            'modules' => self::MODULES,
            'total'   => count(self::MODULES),
            'active'  => count(array_filter(self::MODULES, fn($m) => $m['status'] === 'active')),
        ]);
    }
}
