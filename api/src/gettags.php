<?php

/**
 * Responsible for handling /gettags endpoint.
 *
 * This class is used to get available tags.
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

        // Create SQL command to get tags.
        $sql = "SELECT tag_id, tag_name FROM tag";
        $params = array();

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }
}
