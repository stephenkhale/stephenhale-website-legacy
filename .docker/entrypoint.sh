#!/bin/sh

if [ ! -f "vendor/autoload.php" ]; then
  echo "Installing Composer dependencies..."
  composer install --no-ansi --no-interaction --no-plugins --no-progress --no-scripts --optimize-autoloader
else
  echo "Composer dependencies already installed."
fi
php artisan migrate
php artisan clear
php artisan optimize:clear
echo "Starting PHP-FPM..."
php-fpm