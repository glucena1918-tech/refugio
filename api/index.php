<?php

// Ensure view compilation directory exists in writable /tmp
if (!is_dir('/tmp/views')) {
    mkdir('/tmp/views', 0755, true);
}

// Copy SQLite database to /tmp on startup so it is writable
$templateDb = __DIR__ . '/../database/database.sqlite';
$targetDb = '/tmp/database.sqlite';
if (file_exists($templateDb) && !file_exists($targetDb)) {
    copy($templateDb, $targetDb);
}

// Forward Vercel serverless requests to Laravel public bootstrap
require __DIR__ . '/../public/index.php';
