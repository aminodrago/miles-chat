# Miles Chat

Miles chat is a simple, single room chat application built in PHP using the [Laravel 4 framework](http://laravel.com/), and also React.js for front end.  Features include user authentication, rudimentary file upload/sharing, and browsable and searchable chat archives.

There is a live demo of Miles Chat [here](http://chat.sixthree1.com).  All user accounts, chat messages, and file uploads are reset daily.

## Installation

If you are new to Laravel and/or have not installed a Laravel application before, please see [the Laravel documentation](http://laravel.com/docs/installation) for more general information.  

**Requirements:**

1. PHP >= 5.3.7

2. MCrypt PHP Extension

3. [Composer](https://getcomposer.org/)

4. MySQL >= 5.6.  Miles-Chat uses an InnoDB FULLTEXT index for search, which was not supported until version 5.6.


**Installation Steps:**

1. `git clone https://github.com/brshewmaker/miles-chat.git`

2. Create mysql DB 

3. In app/config/app.php, change 'debug' => true to false if this isn't a dev environment.

4. In app/config/app.php, change 'key' => 'YourSecretKey!!!' to a random 32 bit string

5. In app.config/app.php, change the timezone to the timezone of your server

6. In app/config/database.php, change the mysql DB connection options to your database and username/password

7. Optionally, you can change the path for file uploads in app/config/uploads.php

8. In the miles-chat path, run `composer install --prefer-dist --no-dev`  You can leave off the --no-dev if you also want to install the dev packages from composer.json

9. Run `composer dump-autoload`

10. Run the database migrations:

	`php artisan migrate:install`

	`php artisan migrate`

11. Create a new virtual host for the application or you can also create a symbolic link to the /public folder of miles-chat.  For example, on a typical Ubuntu LAMP stack you could do 

`sudo ln -s /path/to/miles-chat/public /var/www/miles-chat`

which would allow you to go to http://localhost/miles-chat.

## Why does this even exist?

Why write yet another simple chat application?  Because I wanted to scratch an itch and learn something.  I actually do use this very simple application on my home server with a user base of 2 (my server is named Miles, hence the names Miles Chat).  As long as my friend and I keep using this chat then this author is happy with the results.  If you find it useful in any way, then that's just an added side bonus.
