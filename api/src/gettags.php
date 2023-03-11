<?php

/**
 * Responsible for handling /gettags endpoint.
 *
 * This class reads and validates received parameters
 * and returns the tags from the database.
 *
 * @author Szymon Jedrzychowski
 */
class GetTags extends Endpoint
{
    /**
     * Override parent method to prepare SQL command and variables to get the tags from database.
     *
     * @throws BadRequest If incorrect request method was used or incorrect parameter was provided.
     */
    protected function initialiseSQL()
    {
        // Check if correct request method was used.
        $this->validateRequestMethod("GET");

        // Create SQL command to get newsleter items.
        $sql = "SELECT tag_id, tag_name FROM tag";
        $params = array();

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }
}