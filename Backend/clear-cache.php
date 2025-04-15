<?php
echo exec('php artisan config:clear');
echo exec('php artisan cache:clear');
echo exec('php artisan route:clear');
echo "Cache cleared!";
