<?php

/**
 * Responsible for handling /removetag endpoint.
 *
 * This class reads and validates received parameters
 * and removes tag from database and newsletter items.
 *
 * @author Szymon Jedrzychowski
 */
class RemoveTag extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /removetag endpoint.
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

        // Validate the update parameters.
        $this->validateParameters();

        // Validate the JWT.
        $tokenData = parent::validateToken();
        if(!in_array($tokenData->auth, ["2", "3"])){
            throw new BadRequest("Only editor and admin can remove tags.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            $sql = "DELETE FROM item_tag WHERE tag_id = :tag_id";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_id' => $_POST['tag_id']
            ]);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            $sql = "DELETE FROM tag WHERE tag_id = :tag_id";

            $this->setSQLCommand($sql);

            $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            // Commit the transaction.
            $db->commitTransaction();

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
     * @throws ClientErrorException If incorrect parameters were used.
     */
    private function validateParameters()
    {   
        $requiredParameters = array('tag_id');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /removetag endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return [
            'tag_id' => 'int'
        ];
    }
}
