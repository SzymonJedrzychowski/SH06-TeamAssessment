<?php

/**
 * General exception handler
 *
 * Function that prints a json of exception when one happens with error location and message.
 * 
 * @author Szymon Jedrzychowski
 */
function exceptionHandler($e){
    http_response_code(500);
    $output['message'] = $e->getMessage();
    $output['location']['file'] = $e->getFile();
    $output['location']['line'] = $e->getLine();
    echo json_encode($output);
}
