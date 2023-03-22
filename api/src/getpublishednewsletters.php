<?php

/**
 * Responsible for handling /getpublishednewsletters endpoint.
 *
 * This class is used to get the data of published newsletters.
 *
 * @author Szymon Jedrzychowski
 */
class GetPublishedNewsletters extends Endpoint
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

        // Create SQL command to get published newsletters.
        $sql = "SELECT newsletter_id, newsletter_content, date_published, first_name, last_name FROM published_newsletter JOIN user ON published_newsletter.user_id = user.user_id ORDER BY newsletter_id DESC";
        $params = array();

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        $this->setSQLCommand($sql);
        $this->setSQLParams($params);
    }
}
