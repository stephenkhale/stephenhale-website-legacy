FROM php:8.5-fpm-alpine

WORKDIR /var/www/html

COPY --from=composer:2.9 /usr/bin/composer /usr/local/bin/composer

RUN docker-php-ext-install pdo pdo_mysql

CMD ["php-fpm"]