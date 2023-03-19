<?php

/**
 * Load the configuration for the API.
 * 
 * @author Szymon Jedrzychowski
 */

define('SECRET', "69q/hn?T{Mc>`7&y?W3D@LB?M8s9h=");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'exceptionhandler.php';
set_exception_handler('exceptionHandler');

include 'errorhandler.php';
set_error_handler('errorHandler');

include 'autoloader.php';
spl_autoload_register('autoloader');

define('API_KEY', "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");