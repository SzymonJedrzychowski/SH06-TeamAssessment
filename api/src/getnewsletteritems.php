<?php

/**
 * Responsible for handling /getnewsletteritems endpoint.
 *
 * This class reads and validates received parameters
 * and returns the newsletter items from the database.
 *
 * @author Szymon Jedrzychowski
 */
class GetNewsletterItems extends Verify
{
    /**
     * Override parent method to prepare SQL command and variables to get the newsletter items from database.
     *
     * @throws BadRequest If incorrect request method was used.
     */
    protected function initialiseSQL()
    {
        // Check if correct request method was used.
        $this->validateRequestMethod("GET");

        // Create SQL command to get newsletter items.
        $sql = "SELECT item_id, content, date_uploaded, published_newsletter_id, item_title, item_checked, user.first_name, user.last_name, organisation.organisation_name FROM newsletter_item JOIN user ON newsletter_item.user_id = user.user_id JOIN organisation ON user.organisation_id = organisation.organisation_id WHERE item_checked != -1";
        $params = array();

        // Check if correct params were provided.
        $this->checkAvailableParams($this->getAvailableParams());

        // Get only published/unpublished items.
        if (filter_has_var(INPUT_GET, 'published')) {
            if ($_GET['published'] == "true") {
                $sql .= " AND published_newsletter_id IS NOT NULL";
            } elseif ($_GET['published'] == "false") {
                $sql .= " AND published_newsletter_id IS NULL";
            }
        }

        // Get only one item with given item_id.
        if(filter_has_var(INPUT_GET, 'item_id')){
            $sql .= " AND item_id == :item_id";
            $params["item_id"] = $_GET['item_id'];
        }

        // Validate the JWT.
        $tokenData = parent::validateToken();

        // If accessed from partner page, show only item of given partner.
        if ($_GET['partner_access'] == "true") {
            $sql .= " AND newsletter_item.user_id = :user_id";
            $params["user_id"] = $tokenData->sub;
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
        return [
            'published' => 'boolean',
            'item_id' => 'int',
            'partner_access' => 'boolean'
        ];
    }
}
