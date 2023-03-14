<?php

/**
 * Responsible for handling /checkuniqueemail endpoint.
 *
 * @author Mikolaj Furmanczak
 */
class CheckUniqueEmail extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /checkuniqueemail endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */
    // Connect to the database.
    $db = new Database("db/database.db");
    // Check if correct request method was used.
    $this->validateRequestMethod("POST");
    // Validate the parameters.
    $this->validateParameters();

    public  function __construct()
    { 
        $sql = "SELECT organisation_domain FROM organisation;";  
        $this->setSQLCommand($sql);
        $this->setSQLParams();

        // Initialise the SQL command and parameters to insert new data to database.
        $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        
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
        // check if organisation_domain exists in the organisation table
        if 
    }
}
?>