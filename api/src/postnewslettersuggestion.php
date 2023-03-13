<?php

/**
 * Responsible for handling /postnewslettersuggestion endpoint.
 *
 * This class reads and validates received parameters
 * and adds new newsletter suggestion.
 *
 * @author Szymon Jedrzychowski
 */
class PostNewsletterSuggestion extends Endpoint
{
    /**
     * Override the __construct method to match the requirements of the /postnewslettersuggestion endpoint.
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
        $requiredParameters = array('item_id', 'suggestion_content', 'suggestion_comment', 'user_id');
        $this->checkRequiredParameters($requiredParameters);
    }

    protected function initialiseSQL()
    {
        $sql = "INSERT INTO item_suggestion (item_id, suggestion_content, suggestion_comment, user_id) 
        VALUES (:item_id, :suggestion_content, :suggestion_comment, :user_id)";

        $this->setSQLCommand($sql);
        $this->setSQLParams([
            'item_id' => $_POST['item_id'],
            'suggestion_content' => $_POST['suggestion_content'],
            'suggestion_comment' => $_POST['suggestion_comment'],
            'user_id' => $_POST['user_id']
        ]);
    }

    /**
     * Set the array of available parameters for /postnewslettersuggestion endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'item_id' => 'int',
            'suggestion_content' => 'string',
            'suggestion_comment' => 'string',
            'user_id' => 'int'
        ];
    }
}
