FROM php:8.5-fpm-alpine

WORKDIR /var/www/html

RUN apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo_mysql zip gd

COPY src .

COPY --from=composer:2.9 /usr/bin/composer /usr/bin/composer

COPY .docker/entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
