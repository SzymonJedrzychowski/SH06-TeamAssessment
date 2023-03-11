<?php

/**
 * Responsible for handling /changeitemstatus endpoint.
 *
 * This class reads and validates received parameters
 * and modifies status of newsletter item
 *
 * @author Szymon Jedrzychowski
 */
class ChangeItemStatus extends Endpoint
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

        // Validate the update parameters.
        $this->validateParameters();

        // Initialise the SQL command and parameters to insert new data to database.
        $this->initialiseSQL();
        $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

        $this->setData(array(
            "length" => 0,
            "message" => "Success",
            "data" => null
        ));
    }

    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {
        // Check if item_id parameter was included.
        if (!filter_has_var(INPUT_POST, 'item_id')) {
            throw new ClientErrorException("item_id parameter required", 400);
        }

        // Check if status parameter was included.
        if (!filter_has_var(INPUT_POST, 'item_checked')) {
            throw new ClientErrorException("item_checked parameter required", 400);
        }
    }

    protected function initialiseSQL()
    {
        $sql = "UPDATE newsletter_item SET item_checked = :item_checked
        WHERE item_id = :item_id";

        $this->setSQLCommand($sql);
        $this->setSQLParams([
            'item_id' => $_POST['item_id'],
            'item_checked' => $_POST['item_checked']
        ]);
    }
}
