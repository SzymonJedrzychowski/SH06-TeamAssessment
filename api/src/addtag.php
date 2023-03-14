<?php

/**
 * Responsible for handling /addtag endpoint.
 *
 * This class reads and validates received parameters
 * and adds new tag to the database.
 *
 * @author Szymon Jedrzychowski
 */
class AddTag extends Verify
{
    /**
     * Override the __construct method to match the requirements of the /addtag endpoint.
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

        if (!in_array($tokenData->auth, ["2", "3"])) {
            throw new BadRequest("Only editor and admin can edit tags.");
        }

        // Start the transaction.
        $db->beginTransaction();

        try {
            $sql = "SELECT * FROM tag WHERE tag_name = :tag_name";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name']
            ]);

            $data = $db->executeSQL($this->getSQLCommand(), $this->getSQLParams());

            if (count($data) > 0) {
                throw new Exception("Tag with given name already exists.");
            }

            $sql = "INSERT INTO tag (tag_name) VALUES (:tag_name)";

            $this->setSQLCommand($sql);
            $this->setSQLParams([
                'tag_name' => $_POST['tag_name']
            ]);

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
        $requiredParameters = array('tag_name');
        $this->checkRequiredParameters($requiredParameters);
    }

    /**
     * Set the array of available parameters for /addtag endpoint.
     *
     * @return string[] Array of available params.
     */
    protected function getAvailableParams()
    {
        return ['tag_name' => 'string'];
    }
}
