<?php

/**
 * Responsible for handling /postnewslettersuggestion endpoint.
 *
 * This class is used to post newsletter suggestion.
 *
 * @author Szymon Jedrzychowski
 */
class PostNewsletterSuggestion extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /postnewslettersuggestion endpoint.
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
        if (!in_array($tokenData->auth, ["2", "3"])) {
            throw new BadRequest("Only editor and admin can publish a newsletter suggestion.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Check if there is unresolved suggestion for the newsletter_item.
            $sql = "SELECT * FROM item_suggestion WHERE item_id = :item_id AND approved IS NULL";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw an exception if there is unresolved suggestion.
            if (count($data) > 0) {
                throw new ClientErrorException("EM: There is an unresolved suggestion for this item.");
            }

            // End step 1.

            // Step 2. Check if the newsletter_item is already published.
            $sql = "SELECT * FROM newsletter_item WHERE item_id = :item_id AND published_newsletter_id IS NOT NULL";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw an exception if the newsletter_item is already ready.
            if (count($data) > 0) {
                throw new ClientErrorException("EM: This item is already published.");
            }

            // End step 2.

            // Step 3. Insert the newsletter suggestion.
            $sql = "INSERT INTO item_suggestion (item_id, suggestion_content, suggestion_comment, user_id) 
                VALUES (:item_id, :suggestion_content, :suggestion_comment, :user_id)";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id'],
                'suggestion_content' => $_POST['suggestion_content'],
                'suggestion_comment' => $_POST['suggestion_comment'],
                'user_id' => $tokenData->sub
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // End step 3.

            // Step 4. Update the status of the newsletter_item.
            $sql = "UPDATE newsletter_item SET item_checked = 1 WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $data = $db->executeCountedSQL($this->getSQLCommand(), $this->getSQLParams());

            // Throw exception if no newsletter_item was updated.
            if ($data == 0) {
                throw new ClientErrorException("Problem with finding item_id occurred.");
            }

            // End step 4.

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
        $requiredParameters = array('item_id', 'suggestion_content', 'suggestion_comment');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /postnewslettersuggestion endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'item_id' => 'int',
            'suggestion_content' => 'string',
            'suggestion_comment' => 'string'
        ];
    }
}
