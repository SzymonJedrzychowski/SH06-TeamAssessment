<?php

/**
 * Responsible for handling /removepublishednewsletter endpoint.
 *
 * This class is used to remove published newsletters.
 *
 * @author Szymon Jedrzychowski
 */
class RemovePublishedNewsletter extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /removepublishednewsletter endpoint.
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

        // Throw exception if user is not editor or admin.
        if ($tokenData->auth != "3") {
            throw new BadRequest("Only admin can remove a newsletter.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Delete from published_newsletter table.
            $sql = "DELETE FROM published_newsletter WHERE newsletter_id = :newsletter_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'newsletter_id' => $_POST['newsletter_id'],
            ]);

            $data = $db->executeCountedSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw an exception if no data was removed.
            if ($data == 0) {
                throw new ClientErrorException("published_newsletter with given newsletter_id could not be found.");
            }

            // End step 1.

            // Step 2. Update published_newsletter_id for newsletter_items that were in the published newsletter.
            $sql = "UPDATE newsletter_item SET published_newsletter_id = NULL WHERE published_newsletter_id = :newsletter_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                ":newsletter_id" => $_POST["newsletter_id"]
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

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
        $requiredParameters = array('newsletter_id');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /removepublishednewsletter endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'newsletter_id' => 'int'
        ];
    }
}
