<?php

/**
 * Responsible for handling /changeitemstatus endpoint.
 *
 * This class reads and validates received parameters
 * and modifies status of newsletter item
 *
 * @author Szymon Jedrzychowski
 */
class ChangeItemStatus extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /changeitemstatus endpoint.
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

        // Start the transaction.
        $db->beginTransaction();

        try {
            // Step 1. Get user_id of author of the newsletter_item.
            $sql = "SELECT item_id, user_id FROM newsletter_item WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Allow partners to only change their items and check if item was found in db.
            if (count($data) == 0) {
                throw new ClientErrorException("Problem with getting newsletter_item occured.");
            } else if ($data[0]["user_id"] != $tokenData->sub and $_POST["partner_access"] == "true") {
                throw new BadRequest("Editors can only edit their own items.");
            }

            // End step 1.

            // Step 2. Update the item_checked of newsletter_item.
            $sql = "UPDATE newsletter_item SET item_checked = :item_checked WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id'],
                'item_checked' => $_POST['item_checked']
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
        $requiredParameters = array('item_id', 'item_checked');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /changeitemstatus endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'item_id' => "int",
            'item_checked' => "int",
            'partner_access' => "boolean"
        ];
    }
}
