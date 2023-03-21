<?php

/**
 * Responsible for handling /getlastpublishednewsletter endpoint.
 *
 * This class reads and validates received parameters
 * and returns the last published newsletter.
 *
 * @author Noorullah Niamatullah
 */
class GetLastPublishedNewsletter extends Endpoint
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
        $sql = "SELECT newsletter_id, newsletter_content, date_published, first_name, last_name FROM published_newsletter JOIN user ON published_newsletter.user_id = user.user_id
        ORDER BY newsletter_id DESC LIMIT 1
        ";
        $params = array();

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }
}