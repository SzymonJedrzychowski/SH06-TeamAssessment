<?php
use SendGrid\Mail\Mail;
use SendGrid\Sendgrid;
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
        $email = new Mail();
        // Connect to the database.
        $db = new Database("db/database.db");
        // Check if correct request method was used.
        $this->validateRequestMethod("POST");

        // Initialise the SQL command and parameters to get email list from database.
        $sql = "SELECT subscriber_email FROM newsletter_subscriber;";
        $this->setSQLCommand($sql);
        $this->setSQLParams([]);
        // Get email list from database.
        $db_email = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());     
        $email_list = array("dummy@email.domain"=>"email");

        for($i = 0; $i < count($db_email); $i++){
            $email_list[$db_email[$i]['subscriber_email']] = $db_email[$i]['subscriber_email'];
        } 
        $email->addTos($email_list);
        $email->setSubject("New Newsletter is here!");
        $email->addHeader("IC3Newsletter");
        $email->setFrom("mikolaj.furmanczak@northumbria.ac.uk", "IC3 Newsletter");
        $email->setReplyTo("mikolaj.furmanczak@northumbria.ac.uk", "IC3 Reply");
        $email->setTemplateId("d-a0e49613988f410d8524b8aeea0f1740");


        // $sendgrid = new SendGrid(API_KEY);
        $sendgrid = new SendGrid("");
        try {
            $response = $sendgrid->send($email);
            print $response->statusCode() . "\n";
            print_r($response->headers());
            print $response->body() . "\n";
        } catch (Exception $e) {
            echo 'Caught exception: '.  $e->getMessage(). "\n";
        }
        // Set the response data.
        $this->setData(array(
            "length" => 0,
            "message" => "Success",
            "data" => null
        )); 
    }
}
?>