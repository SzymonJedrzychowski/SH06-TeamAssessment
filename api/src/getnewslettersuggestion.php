<?php

/**
 * Responsible for handling /getnewslettersuggestion endpoint.
 * 
 * This class returns newsletter item suggestions if the 
 * parameters passed to it are suitable.
 * 
 * @author Matthew Cartwright
 */
class GetNewsletterSuggestion extends Verify
{
    /**
     * Override parent method to prepare the SQL command.
     * 
     * @throws BadRequest If incorrect method used or parameters provided
     */
    protected function initialiseSQL()
    {
        
        // Check method
        $this->validateRequestMethod("GET");

        // Initialise SQL reques
        $sql = "SELECT suggestion_id, suggestion_content, suggestion_comment, suggestion_response, approved
        FROM item_suggestion
        WHERE item_id = :item_id 
        ORDER BY suggestion_id DESC LIMIT 1";
        $params = array();

        // Ensure the correct parameters were provided
        $this->checkAvailableParams($this->getAvailableParams());

        $params[":item_id"] = $_GET["item_id"];

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }

    /**
     * Set the array of available parameters for /getnewsletteritems endpoint.
     * 
     * @return string[] Array of available parameters.
     */
    protected function getAvailableParams()
    {
        return [
            'item_id' => 'int',
            'approved' => 'boolean'
        ];
    }
}
