<?php

/**
 * Endpoint for handling incorrect endpoint calls (wrong parameters, paths etc.).
 *
 * This class is used when Exceptions are thrown to get the message and code of the Exception
 * and process it to the standardised endpoint response.
 *
 * @author Szymon Jedrzychowski
 */
class ClientError extends Endpoint
{
    /**
     * Override the __construct method to only return the data based on the Exception data.
     *
     * @param string    $message    Message that explains the error.
     * @param int       $code       HTTP code relevant to the error.
     */
    public function __construct($message = "", $code)
    {
        // Set the relevant response code.
        http_response_code($code);

        $this->setData(array(
            "length" => 0,
            "message" => $message,
            "data" => null
        ));
    }
}
