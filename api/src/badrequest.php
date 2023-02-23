<?php

/**
 * Class that is used as alternative Exception.
 *
 * This class is used to throw the Exception
 * whenever incorrect param was provided for specific endpoint
 * or incorrect request method was used.
 *
 * @author Szymon Jedrzychowski
 */
class BadRequest extends Exception
{
    /**
     * Override the Exception constructor to set code 400 by default.
     *
     * @param string    $message    Message that explains the error.
     * @param int       $code       HTTP code relevant to the error.
     *                              Default value: 400.
     */
    public function __construct($message, $code = 400)
    {
        parent::__construct($message, $code);
    }
}
