FROM php:8.3-fpm

# Install PHP dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql bcmath gd zip

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy source code
COPY . .

# Install backend dependencies
RUN composer install --no-dev --optimize-autoloader

# Install frontend deps & build Vite assets
RUN npm install && npm run build

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

CMD ["php-fpm"]
