<?php

// Set CORS headers
header("Access-Control-Allow-Origin: http://localhost:4200"); // Allow your Angular app's URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE"); // Allow specific methods
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, Authorization");

// Run Artisan commands
$output = shell_exec('php ../artisan config:clear');
echo "Config cleared: " . $output;

$output = shell_exec('php ../artisan cache:clear');
echo "Cache cleared: " . $output;

$output = shell_exec('php ../artisan route:clear');
echo "Routes cleared: " . $output;
