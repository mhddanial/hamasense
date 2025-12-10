FROM php:8.3-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set workdir
WORKDIR /var/www

# Copy Laravel files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy env if needed
# RUN cp .env.example .env && php artisan key:generate

# Set permission
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
