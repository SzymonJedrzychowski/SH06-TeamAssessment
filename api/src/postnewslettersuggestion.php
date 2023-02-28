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

        // Validate the update parameters.
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
        // Check if itemID parameter was included.
        if (!filter_has_var(INPUT_POST, 'itemID')) {
            throw new ClientErrorException("itemID parameter required", 400);
        }

        // Check if suggestionContent parameter was included.
        if (!filter_has_var(INPUT_POST, 'suggestionContent')) {
            throw new ClientErrorException("suggestionContent parameter required", 400);
        }

        // Check if suggestionComment parameter was included.
        if (!filter_has_var(INPUT_POST, 'suggestionComment')) {
            throw new ClientErrorException("suggestionComment parameter required", 400);
        }

        // Check if userID parameter was included.
        if (!filter_has_var(INPUT_POST, 'userID')) {
            throw new ClientErrorException("userID parameter required", 400);
        }
    }

    protected function initialiseSQL()
    {
        $sql = "INSERT INTO itemSuggestion (itemID, suggestionContent, suggestionComment, userID) 
        VALUES (:itemID, :suggestionContent, :suggestionComment, :userID)";

        $this->setSQLCommand($sql);
        $this->setSQLParams([
            'itemID' => $_POST['itemID'],
            'suggestionContent' => $_POST['suggestionContent'],
            'suggestionComment' => $_POST['suggestionComment'],
            'userID' => $_POST['userID']
        ]);
    }
}
