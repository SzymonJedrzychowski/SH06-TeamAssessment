<?php

/**
 * General error handler
 *
 * Throw an exception if the error is not a warning (2) or notice (8). 
 * Do nothing otherwise.
 * 
 * @author Szymon Jedrzychowski
 */
function errorHandler($errno, $errstr, $errfile, $errline)
{
    if ($errno != 2 && $errno != 8) {
        throw new Exception("Error Detected: [$errno] $errstr file: $errfile line: $errline", 1);
    }
}
