<?php

/**
 * Responsible for handling /addtag endpoint.
 *
 * This class reads and validates received parameters
 * and adds new tag to the database.
 *
 * @author Szymon Jedrzychowski
 */
class AddTag extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /addtag endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */
    public  function __construct()
    {
        // Connect to the database.
        $db = new Database("db/database.db");

        // Check if correct request method was used.
        $this->validateRequestMethod("POST");

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        // Validate the update parameters.
        $this->validateParameters();

        // Initialise the SQL command and parameters to insert new data to database.
        $this->initialiseSQL();
        $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        $this->setData(array(
            "length" => 0,
            "message" => "Success",
            "data" => null
        ));
    }

    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {   
        $requiredParameters = array('tag_name');
        $this->checkRequiredParameters($requiredParameters);
    }

    protected function initialiseSQL()
    {
        $sql = "INSERT INTO tag (tag_name) 
        VALUES (:tag_name)";

        $this->setSQLCommand($sql);
        $this->setSQLParams([
            'tag_name' => $_POST['tag_name']
        ]);
    }

    /**
     * Set the array of available parameters for /addtag endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return ['tag_name' => 'string'];
    }
}
