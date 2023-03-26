<?php

/**
 * Responsible for handling /postnewsletteritem endpoint.
 *
 * This class validates and updates newsletter items
 *
 * @author Matthew Cartwright
 */

class UpdateNewsletterItem extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /updatenewsletteritem endpoint.
     * 
     * @throws BadRequest           If request method is incorrect
     */
    public function __construct()
    {
        // Connect
        $db = new Database("db/database.db");

        // Ensure correct method has been used
        $this->validateRequestMethod("POST");

        // Ensure correct parameters used
        $this->checkAvailableParams($this->getAvailableParams());
        $this->validateParameters();

        // Validate JWT
        $tokenData = parent::validateToken();

        // Ensure user is signed in
        if (!in_array($tokenData->auth, ["1", "2", "3"])) {
            throw new BadRequest("You must be signed in to edit items, please sign in!");
        }

        $itemChecked = $_POST['item_checked'];
        // Ensure the item can be edited
        if ($itemChecked == "-1") {
            throw new BadRequest("You can no longer edit this item!");
        }

        // If item is ready, unready it        
        if ($itemChecked == "3") {
            $itemChecked = "0";
        }

        // Start transaction
        $db->beginTransaction();

        try {
            // Initialise SQL for insertion
            if (filter_has_var(INPUT_POST, "item_title")) {
                $sql = "UPDATE newsletter_item
                SET content = :content, item_title = :item_title, item_checked = :item_checked 
                WHERE item_id = :item_id";

                $this->setSQLParams([

                    // Main item content passed via POST
                    ':content' => $_POST['content'],

                    // Item title passed via POST
                    ':item_title' => $_POST['item_title'],

                    // Item status passed via variable (should only change if it was "3")
                    ':item_checked' => $itemChecked,

                    // User ID from the token authorising them
                    ':item_id' => $_POST['item_id']
                ]);
            } else {
                $sql = "UPDATE newsletter_item
                SET content = :content, item_checked = :item_checked
                WHERE item_id = :item_id";

                $this->setSQLParams([

                    // Main item content passed via POST
                    ':content' => $_POST['content'],

                    // Item status passed via variable (should only change if it was "3")
                    ':item_checked' => $itemChecked,

                    // User ID from the token authorising them
                    ':item_id' => $_POST['item_id']
                ]);
            }

            // Safely pass the values into the SQL command
            $this->setSQLCommand($sql);

            // Execute the SQL command
            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Commit the transaction
            $db->commitTransaction();

            // Confirm
            $this->setData(array(
                "length" => 0,
                "message" => "Success",
                "data" => null
            ));
        } catch (Exception $e) {
            $db->rollbackTransaction();
            throw $e;
        }
    }
    /**
     * Check if correct parameters were used.
     *
     * @throws ClientErrorException if incorrect parameters were used.
     */
    private function validateParameters()
    {
        $requiredParameters = array('content', 'item_id', 'item_checked');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /postnewsletteritem endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'content' => 'string',
            'item_id' => 'string',
            'item_checked' => 'string',
            'item_title' => 'string'
        ];
    }
}
