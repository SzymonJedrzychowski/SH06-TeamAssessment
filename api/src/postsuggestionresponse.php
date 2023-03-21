<?php

/**
 * Responsible for handling /postsuggestionresponse endpoint
 *
 * This class is used to post the response to a suggestion
 *
 * @author Matthew Cartwright
 */
class PostSuggestionResponse extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /postsuggestionresponse endpoint
     *
     * @throws BadRequest           If request method is incorrect or non-authorised user used the endpoint
     * @throws ClientErrorException If incorrect parameters were used
     */
    public  function __construct()
    {
        // Connect to the database
        $db = new Database("db/database.db");

        // Check if correct request method was used
        $this->validateRequestMethod("POST");

        // Check if correct params were provided
        $this->checkAvailableParams($this->getAvailableParams());
        $this->validateParameters();

        // Validate the JWT
        $tokenData = parent::validateToken();

        // Throw exception if user is not editor or admin
        if (!in_array($tokenData->auth, ["1", "2", "3"])) {
            throw new BadRequest("You must be signed in to respond to a suggestion. Please sign in.");
        }

        // Throw exception if item has already been responded to
        if ($_POST['item_status'] != "1") {
            throw new BadRequest("There must be an active suggestion for you to respond to.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {

            // 1 - Update the suggestion fields (only for the current user)
            $sql = "UPDATE item_suggestion
                    SET approved = :approved, suggestion_response = :suggestion_response
                    WHERE suggestion_id = :suggestion_id 
                    AND :user_id IN 
                        (SELECT newsletter_item.user_id FROM newsletter_item
                        JOIN newsletter_item item_suggestion
                        ON newsletter_item.item_id = item_suggestion.item_id)"
                    ;

            $isApproved = 0;
            if ($_POST['approved'] == "true"){
                $isApproved = 1;
            }

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'approved' => $isApproved,
                'suggestion_response' => $_POST['suggestion_response'],
                'suggestion_id' => $_POST['suggestion_id'],
                'user_id' => $tokenData->sub
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());


            // 2 - Update the item_checked status
            $sql = "UPDATE newsletter_item
                    SET item_checked = 2
                    WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Commit the transaction
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
     * Check if correct parameters were used
     *
     * @throws ClientErrorException If incorrect parameters were used
     */
    private function validateParameters()
    {
        $requiredParameters = array('approved', 'suggestion_response', 'suggestion_id', 'item_id', 'item_status');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /postnewslettersuggestion endpoint
     *
     * @return string[] Array of available params
     */
    protected function getAvailableParams()
    {
        return [
            'approved' => 'boolean',
            'suggestion_response' => 'string',
            'suggestion_id' => 'int',
            'item_id' => 'int',
            'item_status' => 'int'
        ];
    }
}
