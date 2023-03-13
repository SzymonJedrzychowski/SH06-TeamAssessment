<?php

/**
 * Responsible for handling /publishnewsletter endpoint.
 *
 * This class reads and validates received parameters
 * and adds posts newsletter to public.
 *
 * @author Szymon Jedrzychowski
 */
class PublishNewsletter extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /publishnewsletter endpoint.
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
        $this->validateParameters();

        // Start the transaction.
        $db->beginTransaction();

        try {

            // Initialise the SQL command and parameters to insert new data to database.
            $sql = "INSERT INTO published_newsletter (newsletter_content, date_published, user_id) 
            VALUES (:newsletter_content, :date_published, :user_id)";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_content' => $_POST['newsletter_content'],
                'date_published' => $_POST['date_published'],
                'user_id' => $_POST['user_id']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());
            $last_id = $db->getLastId();

            // Initialise the SQL command and parameters to modify data of newsletter items.
            $array = json_decode($_POST["newsletter_items"]);

            if($array == null){
                throw new BadRequest("Incorrect format of newsletter_items array.");
            }

            $in = join(',', array_fill(0, count($array), '?'));
            $sql = "UPDATE newsletter_item SET published_newsletter_id = ? WHERE item_id IN (" . $in . ")";

            $this->setSQLCommand($sql);
            $this->setSQLParams(
                array_merge(array($last_id), $array)
            );

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Commit the transaction.
            $db->commitTransaction();

            $this->setData(array(
                "length" => 0,
                "message" => "Success",
                "data" => null
            ));
        } catch (Exception $e) {
            $db->rollbackTransaction();
            throw $e;
        }
    }

    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {
        // Check if newsletter_content parameter was included.
        if (!filter_has_var(INPUT_POST, 'newsletter_content')) {
            throw new ClientErrorException("newsletter_content parameter required", 400);
        }

        // Check if date_published parameter was included.
        if (!filter_has_var(INPUT_POST, 'date_published')) {
            throw new ClientErrorException("date_published parameter required", 400);
        }

        // Check if user_id parameter was included.
        if (!filter_has_var(INPUT_POST, 'user_id')) {
            throw new ClientErrorException("user_id parameter required", 400);
        }

        // Check if newsletter_items parameter was included.
        if (!filter_has_var(INPUT_POST, 'newsletter_items')) {
            throw new ClientErrorException("newsletter_items parameter required", 400);
        }
    }

    /**
     * Set the array of available parameters for /publishnewsletter endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'newsletter_content' => 'string',
            'date_published' => 'string',
            'user_id' => 'int',
            'newsletter_items' => 'string'
        ];
    }
}
