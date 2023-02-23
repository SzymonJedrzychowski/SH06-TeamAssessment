<?php

/**
 * Autoloader method
 *
 * Function that loads necessery functions from src directory if necessary.
 * 
 * @author Szymon Jedrzychowski
 */
function autoloader($className){
    $filename = "src\\" . strtolower($className) . ".php";
    $filename = str_replace('\\', DIRECTORY_SEPARATOR, $filename);
    if (is_readable($filename)) {
        include_once $filename;
    } else {
        exit("File not found: " . $className . " (" . $filename . ")");
    }
}
