<?php

/**
 * Load the configuration for the API.
 * 
 * @author Szymon Jedrzychowski
 */

define('SECRET', "F-JaNdRgUjXn2r5u8x/A?D(G+KbPeShV");
define('API_KEY', "r4u7x!A%D*G-KaPdSgVkXp2s5v8y/B?E");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'exceptionhandler.php';
set_exception_handler('exceptionHandler');

include 'errorhandler.php';
set_error_handler('errorHandler');

include 'autoloader.php';
spl_autoload_register('autoloader');