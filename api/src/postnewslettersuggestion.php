<?php

/**
 * Responsible for handling /postnewslettersuggestion endpoint.
 *
 * This class reads and validates received parameters
 * and adds new newsletter suggestion.
 *
 * @author Szymon Jedrzychowski
 */
class PostNewsletterSuggestion extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /postnewslettersuggestion endpoint.
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
        $tokenData = parent::validateToken();

        if (!in_array($tokenData->auth, ["2", "3"])) {
            throw new BadRequest("Only editor and admin can publish a newsletter suggestion.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
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

            $sql = "UPDATE newsletter_item SET item_checked = :item_checked WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id'],
                'item_checked' => "1"
            ]);

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
