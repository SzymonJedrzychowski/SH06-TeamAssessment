<?php

/**
 * Responsible for handling /addsubscriber endpoint.
 *
 * @author Mikolaj Furmanczak
 */
class AddSubscriber extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /adduser endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */
    public  function __construct()
    { 
        // Connect to the database.
        $db = new Database("db/database.db");

        // Check if correct request method was used.
        $this->validateRequestMethod("POST");

        // Validate the parameters.
        $this->validateParameters();

        // Initialise the SQL command and parameters to insert new data to database.
        $this->initialiseSQL();
        $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        // Set the response data.
        $this->setData(array(
            "message" => "Success",
        ));
    }
    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {   
        // Check if required parameters are present.
        $requiredParameters = array("subscriber_email");
        foreach ($requiredParameters as &$value) {
            if (!filter_has_var(INPUT_POST, $value) || empty($_POST[$value]) ) {
                throw new ClientErrorException($value . " parameter required", 400);
            }
        }
        // Check if email is valid.
        if (!filter_var($_POST["subscriber_email"], FILTER_VALIDATE_EMAIL)) {
            throw new ClientErrorException("Invalid email", 400);
        }
    }
    protected function initialiseSQL()
    {
        $sql = "INSERT INTO newsletter_subscriber (subscriber_email) 
        VALUES (:subscriber_email)";

        $this->setSQLCommand($sql);
        $this->setSQLParams(array(
            ":subscriber_email" => $_POST["subscriber_email"],
        ));
    }
}
?>