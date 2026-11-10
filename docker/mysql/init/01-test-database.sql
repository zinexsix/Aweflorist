-- Database terpisah untuk menjalankan test terhadap MySQL (opsional):
--   DB_CONNECTION=mysql DB_DATABASE=aweflorist_test php artisan test
CREATE DATABASE IF NOT EXISTS aweflorist_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON aweflorist_test.* TO 'aweflorist'@'%';
