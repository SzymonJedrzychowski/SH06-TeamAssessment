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

        // Start the transaction.
        $db->beginTransaction();

        try {
            $sql = "SELECT item_id, user_id FROM newsletter_item WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            if (count($data) == 0) {
                throw new BadRequest("Problem with getting newsletter_item occured.");
            } else if ($data[0]["user_id"] != $tokenData->sub and $tokenData->auth == "1") {
                throw new BadRequest("Editors can only edit their own items.");
            }

            $sql = "UPDATE newsletter_item SET item_checked = :item_checked WHERE item_id = :item_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'item_id' => $_POST['item_id'],
                'item_checked' => $_POST['item_checked']
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
            'item_checked' => "int"
        ];
    }
}
