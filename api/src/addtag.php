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
        // Check if tagName parameter was included.
        if (!filter_has_var(INPUT_POST, 'tagName')) {
            throw new ClientErrorException("tagName parameter required", 400);
        }
    }

    protected function initialiseSQL()
    {
        $sql = "INSERT INTO tags (tagName) 
        VALUES (:tagName)";

        $this->setSQLCommand($sql);
        $this->setSQLParams([
            'tagName' => $_POST['tagName']
        ]);
    }
}
