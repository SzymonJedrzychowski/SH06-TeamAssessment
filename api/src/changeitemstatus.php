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

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());
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
        $requiredParameters = array('item_id', 'item_checked');
        $this->checkRequiredParameters($requiredParameters);
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
