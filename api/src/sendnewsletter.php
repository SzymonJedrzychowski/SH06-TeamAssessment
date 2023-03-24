<?php
use SendGrid\Mail\Mail;
use SendGrid\Sendgrid;
use SendGrid\Mail\Personalization;
use SendGrid\Mail\To;

/**
 * Responsible for handling /sendnewsletter endpoint.
 *
 * @author Mikolaj Furmanczak
 */
class SendNewsletter extends Verify
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

        // Validate the JWT.
        $tokenData = parent::validateToken();
        if(!in_array($tokenData->auth, ["2", "3"])){
            throw new BadRequest("Only editor and admin can send out the newsletter.");
            }
        // Initialise the SQL command and parameters to get email list from database.
        $sql = "SELECT subscriber_email FROM newsletter_subscriber;";
        $this->setSQLCommand($sql);
        $this->setSQLParams([]);
        // Get email list from database.
        $db_email = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());     
        $email_list = array("dummy@email.domain"=>"email");

        for($i = 0; $i < count($db_email); $i++){
            $personalization[$i] = new Personalization();
            $personalization[$i]->addTo(new To($db_email[$i]['subscriber_email']));
            $email->addPersonalization($personalization[$i]);
        } 
        $email->setSubject("New Newsletter is here!");
        $email->addHeader("IC3Newsletter");
        $email->setFrom(EMAIL, "IC3 Newsletter");
        $email->setReplyTo(EMAIL, "IC3 Reply");
        $email->setTemplateId("d-a0e49613988f410d8524b8aeea0f1740");


        $sendgrid = new SendGrid(API_KEY);
        try {
            $sendgrid->send($email);
        } catch (Exception $e) {
            throw new BadRequest($e->getMessage());
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