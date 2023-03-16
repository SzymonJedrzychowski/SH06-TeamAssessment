<?php
require 'vendor/autoload.php';
/**
 * Responsible for handling /sendnewsletter endpoint.
 *
 * @author Mikolaj Furmanczak
 */
class SendNewsletter extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /sendnewsletter endpoint.
     *
     * @throws BadRequest           If request method is incorrect.
     */
    public  function __construct()
    { 
        try{
            // Connect to the database.
            $db = new Database("db/database.db");
            // Check if correct request method was used.
            $this->validateRequestMethod("GET");

            // Initialise the SQL command and parameters to get email list from database.
            $sql = "SELECT subscriber_email FROM newsletter_subscriber;";
            $this->setSQLCommand($sql);
            $this->setSQLParams();
            // Get email list from database.
            $emails = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
            
            $email = new \SendGrid\Mail\Mail();
            $email->setFrom('', 'Newsletter');
            $email->setSubject('The IC3 Newsletter');
            $email->addTo('', ' ');
            $email->addContent("text/plain", "The Newsletter is finally out!");

            $sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));
            try {
                $response = $sendgrid->send($email);
                print $response->statusCode() . "\n";
                print_r($response->headers());
                print $response->body() . "\n";
            } catch (Exception $e) {
                echo 'Caught exception: '. $e->getMessage() ."\n";
            }
            // Check if email already exists.
            if(empty($emails)){
                throw new ClientErrorException("Couldn't fetch emails", 400);
            }
            // Set the response data.
            $this->setData(array(
                "length" => 0,
                "message" => "Success",
                "data" => $emails
            ));
        } catch(Exception $e){
            throw new ClientErrorException($e->getMessage(), 400);
        }
    }
}
?>