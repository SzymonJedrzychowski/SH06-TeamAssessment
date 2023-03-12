<?php

/**
 * Responsible for handling /getitemtags endpoint.
 *
 * This class reads and validates received parameters
 * and returns the tags of newsletter item from the database.
 *
 * @author Szymon Jedrzychowski
 */
class GetItemTags extends Endpoint
{
    /**
     * Override parent method to prepare SQL command and variables to get the tags of newsletter item from database.
     *
     * @throws BadRequest If incorrect request method was used or incorrect parameter was provided.
     */
    protected function initialiseSQL()
    {
        // Check if correct request method was used.
        $this->validateRequestMethod("GET");

        // Create SQL command to get tags of newsleter item.
        $sql = "SELECT tag.tag_id, tag_name FROM item_tag JOIN tag ON item_tag.tag_id = tag.tag_id WHERE item_id = :item_id";

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());
        $this->validateParameters();

        $params = array(":item_id"=>$_GET['item_id']);

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }

    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {
        // Check if item_id parameter was included.
        if (!filter_has_var(INPUT_GET, 'item_id')) {
            throw new ClientErrorException("item_id parameter required", 400);
        }
    }

    /**
     * Set the array of available parameters for /getitemtags endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return ["item_id" => "integer"];
    }
}