## clone repository

git clone https://github.com/indrawdev/dtp-test

## install package

composer update

## setup .env config

set db_username, db_password, db_name on (.env) file

## migrate and seed database

php artisan migrate:refresh --seed

## start

php artisan serve
