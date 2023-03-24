<?php

/**
 * Responsible for handling / endpoint.
 *
 * This class is used to return information about the API.
 *
 * @author Szymon Jedrzychowski
 */
class Base extends Endpoint
{
    public function __construct()
    {
        $this->setData(array(
            "length" => 0,
            "message" => "This API was created for the purposes of the IC3 Newsletter project.",
            "data" => null
        ));
    }
}
