<?php

/**
 * Responsible for handling /editnewsletter endpoint.
 *
 * This class reads and validates received parameters
 * and adds changes the published newsletter.
 *
 * @author Szymon Jedrzychowski
 */
class EditNewsletter extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /editnewsletter endpoint.
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

        // Validate the JWT.
        $tokenData = parent::validateToken(false);

        if(!in_array($tokenData->auth, ["2", "3"])){
            throw new BadRequest("Only editor and admin can modify the newsletter.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {

            // Initialise the SQL command and parameters to insert new data to database.
            $sql = "UPDATE published_newsletter SET newsletter_content = :newsletter_content WHERE newsletter_id = :newsletter_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_id' => $_POST['newsletter_id'],
                'newsletter_content' => $_POST['newsletter_content']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Initialise the SQL command and parameters to insert new data to database.
            $sql = "UPDATE newsletter_item SET published_newsletter_id = :value WHERE published_newsletter_id = :newsletter_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_id' => $_POST['newsletter_id'],
                'value' => null
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Initialise the SQL command and parameters to modify data of newsletter items.
            $array = json_decode($_POST["newsletter_items"]);

            if ($array == null) {
                throw new BadRequest("Incorrect format of newsletter_items array.");
            }

            $in = join(',', array_fill(0, count($array), '?'));
            $sql = "UPDATE newsletter_item SET published_newsletter_id = ? WHERE item_id IN (" . $in . ")";

            $this->setSQLCommand($sql);
            $this->setSQLParams(
                array_merge(array($_POST['newsletter_id']), $array)
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
        $requiredParameters = array('newsletter_content', 'newsletter_items', 'newsletter_id');
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
            'newsletter_content' => 'string',
            'newsletter_items' => 'string',
            'newsletter_id' => 'int'
        ];
    }
}
