<?php

/**
 * Responsible for handling /removenewsletteritem endpoint.
 *
 * This class is used to remove newsletter items.
 *
 * @author Matthew Cartwright
 */
class RemoveNewsletterItem extends Verify
{
    /**
     * Overwrite the __construct method to match the requirements of the /removepublishednewsletter endpoint.
     * 
     * @throws BadRequest
     */
    function __construct()
    {
        // Connect
        $db = new Database("db/database.db");

        // Check fetch method
        $this->validateRequestMethod("POST");

        // Check if correct parameters
        $this->checkAvailableParams($this->getAvailableParams());

        // Validate paramaters
        $this->validateParameters();

        // Validate the JWT
        $tokenData = parent::validateToken();

        // Begin the transaction
        $db->beginTransaction();

        try {
            // Initialise the SQL
            $sql = "DELETE FROM newsletter_item WHERE item_id = :item_id";
            $params = array();
            $params[":item_id"] = $_POST["item_id"];

            // Add condition that partners can only delete their own items
            if (!in_array($tokenData->auth, ["2", "3"])){
                    $sql .= " AND user_id = :user_id";
                    $params[":user_id"] = $tokenData->sub;
                }

            // Set the command and parameters
            $this->setSQLCommand($sql);
            $this->setSQLParams($params);

            // Execute the SQL command
            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Commit the transaction
            $db->commitTransaction();

            $this->setData(array(
                "length" => 0,
                "message" => "Success",
                "data" => null,
                "user_id" => $tokenData->sub
            ));
            }
        catch (Exception $e) {
            $db->rollbackTransaction();
            throw $e;
        }
    }

    /**
     * Check if correct parameters were used
     *
     * @throws ClientErrorException If incorrect parameters used
     */
    private function validateParameters()
    {
        $requiredParameters = ['item_id'];
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /removenewsletteritem endpoint
     *
     * @return string[] Array of available params
     */
    protected function getAvailableParams()
    {
        return [
            'item_id' => 'int'
        ];
    }
}

 