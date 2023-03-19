<?php

/**
 * Responsible for handling /postnewsletteritem endpoint.
 *
 * This class validates and uploads newsletter items
 *
 * @author Matthew Cartwright
 */

class PostNewsletterItem extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /postnewsletteritem endpoint.
     * 
     * @throws BadRequest           If request method is incorrect
     */
    public function __construct()
    {
        // Connect
        $db = new Database("db/database.db");

        // Ensure correct method has been used
        $this->validateRequestMethod("POST");

        // Ensure correct parameters used
        $this->checkAvailableParams($this->getAvailableParams());
        $this->validateParameters();

        // Validate JWT
        $tokenData = parent::validateToken();

        // Ensure user is signed in
        if (!in_array($tokenData->auth, ["1", "2", "3"])){
            throw new BadRequest("You must be signed in to upload, please sign in!");
        }

        // Start transaction
        $db->beginTransaction();

        try {
            // Initialise SQL for insertion
            $sql = "INSERT INTO newsletter_item (user_id, content, date_uploaded, item_title, item_checked)
            VALUES (:user_id, :content, :date_uploaded, :item_title, :item_checked)";
        

            // Safely pass the values into the SQL command
            $this->setSQLCommand($sql);
            $this->setSQLParams([

                // User ID from the token authorising them
                ':user_id' => $tokenData->sub,

                // Main item content passed via POST
                'content' => $_POST['content'],
                
                // Current date passed via POST
                'date_uploaded' => $_POST['date_uploaded'],

                // Item title passed via POST
                'item_title' => $_POST['item_title'],

                // Item checked is 0 by default, but may be changed
                'item_checked' => "0"
            ]);

            // Execute the SQL command
            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Commit the transaction
            $db->commitTransaction();

            // Confirm
            $this->setData(array(
                "length" => 0,
                "message" => "Success",
                "data" => null
            ));
        }
        catch (Exception $e) {
            $db->rollbackTransaction();
            throw $e;
        }
    }
    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException if incorrect parameters were used.
     */
    private function validateParameters()
    {   
        $requiredParameters = array('content', 'date_uploaded', 'item_title');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /publishnewsletter endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'content' => 'string',
            'date_uploaded' => 'string',
            'item_title' => 'string'
        ];
    }
}