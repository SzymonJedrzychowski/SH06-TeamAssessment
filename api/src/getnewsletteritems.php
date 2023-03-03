<?php

/**
 * Responsible for handling /getnewsletteritems endpoint.
 *
 * This class reads and validates received parameters
 * and returns the newsletter items from the database.
 *
 * @author Szymon Jedrzychowski
 */
class GetNewsletterItems extends Endpoint
{
    /**
     * Override parent method to prepare SQL command and variables to get the newsletter items from database.
     *
     * @throws BadRequest If incorrect request method was used or incorrect parameter was provided.
     */
    protected function initialiseSQL()
    {
        // Check if correct request method was used.
        $this->validateRequestMethod("GET");

        // Create SQL command to get newsleter items.
        $sql = "SELECT itemID, userID, content, dateUploaded, publishedNewsletterID, itemTitle, itemChecked FROM newsletterItem";
        $params = array();

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        if(filter_has_var(INPUT_GET, 'published')){
            if($_GET['published'] == "true"){
                $sql .= " WHERE publishedNewsletterID IS NOT NULL";
            }elseif($_GET['published'] == "false"){
                $sql .= " WHERE publishedNewsletterID IS NULL";
            }
        }

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }

    /**
     * Set the array of available parameters for /newsletteritems endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return ['published' => 'boolean'];
    }
}
