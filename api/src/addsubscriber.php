<?php
/**
 * Responsible for handling /addsubscriber endpoint.
 *
 * @author Mikolaj Furmanczak
 */
class AddSubscriber extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /addsubscriber endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */
    public  function __construct()
    { 
        try{
        // Connect to the database.
        $db = new Database("db/database.db");
        // Check if correct request method was used.
        $this->validateRequestMethod("POST");
        // Validate the parameters.
        $this->validateParameters();

        // Initialise the SQL command and parameters to get email list from database.
        $sql = "SELECT subscriber_email FROM newsletter_subscriber WHERE subscriber_email = :subscriber_email;";
        $this->setSQLCommand($sql);
        $this->setSQLParams(array(
            ":subscriber_email" => $_POST["subscriber_email"]
        ));
        // Get email list from database.
        $email = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
        
        // Check if email already exists.
        if(!empty($email)){
            throw new ClientErrorException("Email already exists", 400);
        }

        
        $sql = "INSERT INTO newsletter_subscriber (subscriber_email) 
        VALUES (:subscriber_email)";

        $this->setSQLCommand($sql);
        $this->setSQLParams(array(
            ":subscriber_email" => $_POST["subscriber_email"],
        ));
        $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        // Set the response data.
        $this->setData(array(
            "length" => 0,
            "message" => "Success",
            "data" => null
        ));
        } catch(Exception $e){
            throw new ClientErrorException($e->getMessage(), 400);
        }
    }
    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters(){   
        // Check if required parameters are present.
        if (!filter_has_var(INPUT_POST, "subscriber_email")) {
            throw new ClientErrorException("email parameter required", 400);
        }
        // Check if email is valid.
        if (!filter_var($_POST["subscriber_email"], FILTER_VALIDATE_EMAIL)) {
            throw new ClientErrorException("Invalid email", 400);
        }
    }
}
?>