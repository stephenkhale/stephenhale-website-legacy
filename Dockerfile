FROM php:8.5-fpm-alpine

WORKDIR /var/www/html

RUN docker-php-ext-install pdo pdo_mysql

COPY src .

COPY --from=composer:2.9 /usr/bin/composer /usr/local/bin/composer
RUN --mount=type=cache,target=/root/.cache/composer \
    composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader

CMD ["php-fpm"]