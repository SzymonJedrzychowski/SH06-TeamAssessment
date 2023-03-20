<?php

/**
 * Responsible for handling /publishnewsletter endpoint.
 *
 * This class is used to publish newsletters.
 *
 * @author Szymon Jedrzychowski
 */
class PublishNewsletter extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /publishnewsletter endpoint.
     *
     * @throws BadRequest           If request method is incorrect or non-authorised user used the endpoint.
     * @throws ClientErrorException If incorrect parameters were used.
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
        $tokenData = parent::validateToken();

        // Throw exception if user is not admin.
        if ($tokenData->auth != "3") {
            throw new BadRequest("Only admin can publish a newsletter.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Insert new published newsletter.
            $sql = "INSERT INTO published_newsletter (newsletter_content, date_published, user_id) 
            VALUES (:newsletter_content, :date_published, :user_id)";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_content' => $_POST['newsletter_content'],
                'date_published' => $_POST['date_published'],
                'user_id' => $tokenData->sub
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Get id of last inserted item.
            $last_id = $db->getLastId();

            // End step 1.

            // Step 2. Update published_newsletter_id for newsletter_items that were in the published newsletter.
            $array = json_decode($_POST["newsletter_items"]);

            if ($array === null) {
                throw new ClientErrorException("Incorrect format of newsletter_items array.");
            }

            $in = join(',', array_fill(0, count($array), '?'));
            $sql = "UPDATE newsletter_item SET published_newsletter_id = ?, item_checked = 3 WHERE item_id IN (" . $in . ")";

            $this->setSQLCommand($sql);
            $this->setSQLParams(
                array_merge(array($last_id), $array)
            );

            $data = $db->executeCountedSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw exception if there is a difference in updated items and length of array with items to update.
            if ($data != count($array)) {
                if (count($array) == 1 and $data[0] != null) {
                    throw new ClientErrorException("Problem with updating newsletter_item occured.");
                }
            }

            // End step 2.

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
        $requiredParameters = array('newsletter_content', 'date_published', 'newsletter_items');
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
            'date_published' => 'string',
            'newsletter_items' => 'string'
        ];
    }
}
